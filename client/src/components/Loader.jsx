import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                }}
            />
        </div>
    );
};

export default Loader;
