import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-surface/30"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6 shadow-sm border border-border">
          <Icon className="w-8 h-8 text-textSecondary opacity-80" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-textPrimary mb-2">{title}</h3>
      <p className="text-sm text-textSecondary max-w-sm mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </motion.div>
  );
};

export default EmptyState;
