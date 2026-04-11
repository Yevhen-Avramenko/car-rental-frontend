import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-primary hover:bg-brand-dark text-white',
    secondary: 'bg-brand-light hover:bg-brand-primary hover:text-white text-brand-primary',
    ghost: 'bg-transparent border border-warm-border hover:bg-warm-sand text-warm-ink',
};

export const Button = ({
    variant = 'primary',
    className = '',
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            {...props}
            className={`
                px-5 py-2.5 rounded-md text-sm font-medium transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </button>
    );
};