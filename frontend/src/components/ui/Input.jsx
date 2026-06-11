import React from 'react';

const Input = React.forwardRef(({ className = '', icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-textSecondary" />
        </div>
      )}
      <input
        ref={ref}
        className={`w-full bg-surface border border-border rounded-lg text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ${Icon ? 'pl-10' : 'px-3'} py-2 ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
