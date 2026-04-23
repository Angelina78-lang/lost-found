const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '../data/mock_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'));
}

// Initial data
const initialData = {
    users: [],
    items: [
        {
            _id: '1',
            itemName: 'Example Lost Phone',
            description: 'iPhone 13 with a blue case found near the cafeteria.',
            type: 'Found',
            location: 'Cafeteria',
            date: new Date(),
            contactInfo: 'admin@college.edu',
            createdBy: { _id: '0', name: 'System Admin' },
            createdAt: new Date()
        }
    ]
};

// Load or create mock DB
if (!fs.existsSync(MOCK_DATA_PATH)) {
    fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(initialData, null, 2));
}

const getDb = () => JSON.parse(fs.readFileSync(MOCK_DATA_PATH, 'utf8'));
const saveDb = (data) => fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(data, null, 2));

module.exports = { getDb, saveDb };
