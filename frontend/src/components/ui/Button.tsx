import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'kids';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-[14px]";
  
  const variants = {
    primary: "bg-[#4B9EFF] text-white hover:bg-[#3A82DF] shadow-[0_4px_0_0_#2563eb] active:shadow-[0_0px_0_0_#2563eb] active:translate-y-1 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-[0_4px_0_0_#cbd5e1] active:shadow-[0_0px_0_0_#cbd5e1] active:translate-y-1 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
    outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_0_#b91c1c] active:shadow-[0_0px_0_0_#b91c1c] active:translate-y-1 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    kids: "bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)] hover:from-[#6d28d9] hover:to-[#4f46e5] hover:shadow-[0_12px_25px_rgba(109,40,217,0.45)] active:shadow-[0_4px_10px_rgba(109,40,217,0.3)] active:translate-y-1 focus-visible:ring-4 focus-visible:ring-purple-300"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 py-2 text-[15px]",
    lg: "h-14 px-8 py-3 text-base"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
