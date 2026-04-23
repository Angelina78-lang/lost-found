import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authAPI.login(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass" 
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="animate-float" style={{ display: 'inline-block', padding: '15px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', marginBottom: '15px' }}>
                        <LogIn size={40} color="#a855f7" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue</p>
                </div>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
