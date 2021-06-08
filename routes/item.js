const { Router } = require('express');
const itemController = require('../controllers/itemControllers');
const router = Router();

router.get('/items', itemController.get_items);
router.get('/items/:id', itemController.get_OneItem);
router.get('/items/seller/:id', itemController.get_itemsBySeller);
router.post('/additem',itemController.post_item);
router.put('/items/:id',itemController.update_item);
router.delete('/items/:id',itemController.delete_item);

module.exports = router;

