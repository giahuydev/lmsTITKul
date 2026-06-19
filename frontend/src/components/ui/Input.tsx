import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label className="flex items-center gap-2 text-[15px] font-bold text-[#4f46e5] mb-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "flex w-full rounded-full border-2 border-[#c4b5fd] bg-white px-6 py-4 text-slate-900 font-bold shadow-[0_4px_10px_rgba(139,92,246,0.1)]",
              "transition-all outline-none",
              "placeholder:text-slate-400 placeholder:font-medium placeholder:tracking-normal",
              "focus:border-[#8b5cf6] focus:bg-white focus:ring-4 focus:ring-[#8b5cf6]/20",
              "hover:bg-white hover:border-[#a78bfa]",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              isPassword && "pr-14",
              // Fix autofill background and hide default browser reveal icons (Edge/Chrome)
              "[&:-webkit-autofill]:bg-white [&:-webkit-autofill]:[box-shadow:0_0_0_30px_white_inset]",
              "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none flex items-center justify-center h-full"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-500 font-bold px-4">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
