const jwt = require('jsonwebtoken');
const axios = require('axios');

const token = jwt.sign({ id: '1776925201930', name: 'Debugger' }, 'secret123', { expiresIn: '30d' });

async function testDelete() {
    try {
        const res = await axios.delete('http://localhost:5000/api/items/1776927329694', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.log('Error:', err.response ? err.response.data : err.message);
    }
}

testDelete();
