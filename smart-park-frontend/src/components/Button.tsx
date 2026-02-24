import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
}

const Button = ({ children, onClick, type = "button", className = "" }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;