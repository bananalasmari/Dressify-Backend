const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/user.models');
const config = require('config');
const stripe = require('stripe')(config.get('StripeAPIKey'));


module.exports.get_orders = async (req,res) => {
    const userId = req.params.id;
    Order.find({userId}).sort({date:-1}).then(orders => res.json(orders));
}

module.exports.checkout = async (req,res) => {
    try{
        const userId = req.params.id;
        let cart = await Cart.findOne({userId});
        let user = await User.findOne({_id: userId});
        const email = user.email;
        let id = req.body;
        if(cart){
            const charge = await stripe.paymentIntents.create({
                amount: cart.bill,
                currency: 'USD',
                description: "Your Company Description",
                payment_method: id,
                confirm: true,
                receipt_email: email
            })
            if(!charge) throw Error('Payment failed');
            if(charge){
                const order = await Order.create({
                    userId,
                    items: cart.items,
                    bill: cart.bill
                });
                const data = await Cart.findByIdAndDelete({_id:cart.id});
                return res.status(201).send(order);
            }
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}