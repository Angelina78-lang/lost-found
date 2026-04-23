import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, Search, User, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 1000 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                >
                    <Package size={32} color="#6366f1" />
                </motion.div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Lost & Found
                </h1>
            </Link>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                            <User size={18} />
                            <span>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-outline" style={{ textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
