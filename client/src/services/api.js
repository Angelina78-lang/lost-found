import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authAPI = {
    register: (userData) => API.post('/register', userData),
    login: (userData) => API.post('/login', userData),
};

export const itemAPI = {
    getItems: () => API.get('/items'),
    getItem: (id) => API.get(`/items/${id}`),
    addItem: (itemData) => API.post('/items', itemData),
    updateItem: (id, itemData) => API.put(`/items/${id}`, itemData),
    deleteItem: (id) => API.delete(`/items/${id}`),
    searchItems: (query) => API.get(`/items/search?name=${query}`),
};

export default API;
