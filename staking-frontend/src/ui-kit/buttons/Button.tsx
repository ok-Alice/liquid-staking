interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "sky";
  disabled?: boolean;
}

const variantClasses = {
  primary: "bg-primary-500 hover:bg-primary-700",
  secondary: "bg-secondary-500 hover:bg-secondary-700",
  sky: "bg-sky-500 hover:bg-sky-700",
};

const disabledClasses = {
  primary: "bg-primary-900/20 cursor-not-allowed opacity-50",
  secondary: "bg-secondary-900/20 cursor-not-allowed",
  sky: "bg-sky-900/20 cursor-not-allowed",
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "sky", // Default to "sky" variant
  disabled,
}) => {
  // Determine the class based on variant and disabled state
  const classes = disabled ? disabledClasses[variant] : variantClasses[variant];

  return (
    <button
      disabled={disabled}
      onClick={!disabled ? onClick : undefined} // Prevent onClick if disabled
      className={`px-4 py-3 text-white rounded-2xl ${classes}`}
    >
      {children}
    </button>
  );
};

export default Button;
