interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "sky";
}

const variantClasses = {
  primary: "bg-primary-500 hover:bg-primary-700",
  secondary: "bg-secondary-500 hover:bg-secondary-700",
  sky: "bg-sky-500 hover:bg-sky-700",
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => {
  const classes = variantClasses[variant || "sky"];

  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-white rounded-2xl ${classes}`}
    >
      {children}
    </button>
  );
};

export default Button;
