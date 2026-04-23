const express = require('express');
const {
    addItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    searchItems
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/search', searchItems);

router.route('/')
    .get(getItems)
    .post(protect, addItem);

router.route('/:id')
    .get(getItem)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
