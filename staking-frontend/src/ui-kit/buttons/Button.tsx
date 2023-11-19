interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "sky";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  primary: "bg-primary-500 hover:bg-primary-700",
  secondary: "bg-secondary-500 hover:bg-secondary-700",
  sky: "bg-sky-500 hover:bg-sky-700",
};

const disabledClasses = {
  primary: "bg-primary-500 cursor-not-allowed",
  secondary: "bg-secondary-500 cursor-not-allowed",
  sky: "bg-sky-500 cursor-not-allowed",
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "sky", // Default to "sky" variant
  disabled,
  className,
  type = "button",
}) => {
  // Determine the class based on variant and disabled state
  const classes = disabled ? disabledClasses[variant] : variantClasses[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined} // Prevent onClick if disabled
      className={`px-4 py-3 text-white rounded-2xl ${classes} ${
        className ? className : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
