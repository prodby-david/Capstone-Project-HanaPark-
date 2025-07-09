import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/motionConfigs';

export default function DashboardCard({ 
  icon: Icon, 
  title, 
  value, 
  to 
}) {
  return (
        <motion.div 
        variants={fadeUp}       
        whileHover={{ scale: 1.05 }} 
        transition={{ duration: 0.3}}
        className='flex items-center gap-x-3 w-full bg-white rounded-sm p-5 text-color-3 shadow hover:shadow-lg'
        >
        <Icon className='w-10 h-10' />
        <div>
            <Link 
            to={to} 
            className='flex flex-col font-semibold text-lg'
            >
            {title}
            </Link>
            {value !== undefined && (
            <p className='text-color-2'>{value}</p>
            )}
        </div>
        </motion.div>
  );
}
