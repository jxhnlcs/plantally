import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
        const variants = {
            primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm border-transparent',
            secondary: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-transparent',
            outline: 'bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50',
            ghost: 'bg-transparent text-emerald-700 hover:bg-emerald-50 border-transparent',
            danger: 'bg-red-500 text-white hover:bg-red-600 border-transparent',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-6 py-3.5 text-lg',
            icon: 'p-2',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
