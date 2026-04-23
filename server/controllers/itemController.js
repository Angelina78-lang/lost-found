const Item = require('../models/Item');
const { getDb, saveDb } = require('../config/mockStorage');

exports.addItem = async (req, res) => {
    try {
        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const newItem = { 
                ...req.body, 
                _id: Date.now().toString(), 
                createdBy: { _id: req.user.id, name: req.user.name },
                createdAt: new Date()
            };
            db.items.unshift(newItem);
            saveDb(db);
            return res.status(201).json({ success: true, data: newItem });
        }
        req.body.createdBy = req.user.id;
        const item = await Item.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            return res.status(200).json({ success: true, count: db.items.length, data: db.items });
        }
        const items = await Item.find().populate('createdBy', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getItem = async (req, res) => {
    try {
        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const item = db.items.find(i => i._id === req.params.id);
            if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
            return res.status(200).json({ success: true, data: item });
        }
        const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const index = db.items.findIndex(i => i._id === req.params.id);
            if (index === -1) return res.status(404).json({ success: false, message: 'Item not found' });
            
            if (String(db.items[index].createdBy._id) !== String(req.user.id)) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }
            
            db.items[index] = { ...db.items[index], ...req.body };
            saveDb(db);
            return res.status(200).json({ success: true, data: db.items[index] });
        }

        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        if (item.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const index = db.items.findIndex(i => i._id === req.params.id);
            if (index === -1) return res.status(404).json({ success: false, message: 'Item not found' });
            
            if (String(db.items[index].createdBy._id) !== String(req.user.id)) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }
            
            db.items.splice(index, 1);
            saveDb(db);
            return res.status(200).json({ success: true, data: {} });
        }

        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        if (item.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        await item.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.searchItems = async (req, res) => {
    try {
        const { name } = req.query;
        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const filtered = db.items.filter(i => 
                i.itemName.toLowerCase().includes(name.toLowerCase()) || 
                i.description.toLowerCase().includes(name.toLowerCase())
            );
            return res.status(200).json({ success: true, count: filtered.length, data: filtered });
        }
        const query = name ? {
            $or: [
                { itemName: { $regex: name, $options: 'i' } },
                { description: { $regex: name, $options: 'i' } }
            ]
        } : {};
        const items = await Item.find(query).populate('createdBy', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
