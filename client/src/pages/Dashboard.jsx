import React, { useState, useEffect } from 'react';
import { itemAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MapPin, Calendar, Phone, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Loader from '../components/Loader';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data } = await itemAPI.getItems();
            setItems(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        try {
            const { data } = await itemAPI.searchItems(query);
            setItems(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await itemAPI.updateItem(editingItem._id, formData);
            } else {
                await itemAPI.addItem(formData);
            }
            fetchItems();
            closeModal();
            alert(editingItem ? 'Item updated successfully' : 'Item posted successfully');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await itemAPI.deleteItem(id);
            fetchItems();
            alert('Item deleted successfully');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to delete item');
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            itemName: item.itemName,
            description: item.description,
            type: item.type,
            location: item.location,
            date: item.date.split('T')[0],
            contactInfo: item.contactInfo
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingItem(null);
        setFormData({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
    };

    return (
        <div style={{ padding: '20px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Item Dashboard</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage lost and found items on campus</p>
                </div>

                <div style={{ display: 'flex', gap: '15px', flexGrow: 1, maxWidth: '600px' }}>
                    <div style={{ position: 'relative', flexGrow: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search items by name or description..."
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} />
                        Add Item
                    </button>
                </div>
            </div>

            {loading ? <Loader /> : (
                <motion.div layout className="dashboard-grid">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass glass-hover"
                                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 'bold',
                                        background: item.type === 'Lost' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                        color: item.type === 'Lost' ? 'var(--danger)' : 'var(--success)',
                                        border: `1px solid ${item.type === 'Lost' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                                    }}>
                                        {item.type.toUpperCase()}
                                    </span>
                                    {user && user.id === item.createdBy._id && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => openEditModal(item)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                        </div>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{item.itemName}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>

                                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <MapPin size={14} /> {item.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Calendar size={14} /> {new Date(item.date).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Phone size={14} /> {item.contactInfo}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {item.createdBy.name[0]}
                                    </div>
                                    Posted by {item.createdBy.name}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {showAddModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass" 
                            style={{ width: '100%', maxWidth: '500px', padding: '30px' }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>{editingItem ? 'Edit Item' : 'Report New Item'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    className="input-field"
                                    required
                                    value={formData.itemName}
                                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="input-field"
                                    rows="3"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ resize: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <select 
                                        className="input-field" 
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Lost">Lost</option>
                                        <option value="Found">Found</option>
                                    </select>
                                    <input
                                        type="date"
                                        className="input-field"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="input-field"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Contact Info (Email/Phone)"
                                    className="input-field"
                                    required
                                    value={formData.contactInfo}
                                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <button type="button" className="btn-outline" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2 }}>{editingItem ? 'Update Item' : 'Post Item'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
