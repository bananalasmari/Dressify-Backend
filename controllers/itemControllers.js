const Item = require("../models/itemModel");

module.exports.get_items = (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
};
module.exports.get_OneItem = (req, res) => {
  Item.findOne({ _id: req.params.id }).then((item) => res.json(item));
};

module.exports.get_itemsBySeller = (req, res) => {
  Item.find({ sellerID: req.params.id }).then((item) => res.json(item));
};

module.exports.post_item = (req, res) => {
  const newItem = new Item(req.body);
  newItem.save().then((item) => res.json(item));
};

module.exports.update_item = (req, res) => {
  Item.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (
    item
  ) {
    Item.findOne({ _id: req.params.id }).then(function (item) {
      res.json(item);
    });
  });
};

module.exports.delete_item = (req, res) => {
  Item.findByIdAndDelete({ _id: req.params.id }).then(function (item) {
    res.json({ success: true });
  });
};
