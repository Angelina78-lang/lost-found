const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let itemId = '';

async function testAPI() {
    console.log('--- Starting API Verification ---');

    try {
        // 1. Register
        console.log('Testing Registration...');
        const regRes = await axios.post(`${BASE_URL}/register`, {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log('✅ Registration Successful');
        token = regRes.data.token;
        userId = regRes.data.user.id;

        // 2. Login
        console.log('Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: regRes.data.user.email,
            password: 'password123'
        });
        console.log('✅ Login Successful');

        // 3. Add Item
        console.log('Testing Add Item...');
        const itemRes = await axios.post(`${BASE_URL}/items`, {
            itemName: 'Lost Wallet',
            description: 'Black leather wallet with student ID',
            type: 'Lost',
            location: 'Library Second Floor',
            date: new Date(),
            contactInfo: 'test@example.com'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Add Item Successful');
        itemId = itemRes.data.data._id;

        // 4. Get Items
        console.log('Testing Get Items...');
        const itemsRes = await axios.get(`${BASE_URL}/items`);
        console.log(`✅ Get Items Successful (Found ${itemsRes.data.count} items)`);

        // 5. Search Items
        console.log('Testing Search Items...');
        const searchRes = await axios.get(`${BASE_URL}/items/search?name=Wallet`);
        console.log(`✅ Search Successful (Found ${searchRes.data.count} items matching "Wallet")`);

        // 6. Delete Item
        console.log('Testing Delete Item...');
        await axios.delete(`${BASE_URL}/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Delete Item Successful');

        console.log('--- API Verification Completed Successfully ---');
    } catch (error) {
        console.error('❌ API Verification Failed:');
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Status:', error.response.status);
        } else {
            console.error('Error Message:', error.message);
        }
        process.exit(1);
    }
}

testAPI();
