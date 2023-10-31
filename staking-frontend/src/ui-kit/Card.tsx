import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string; // Optional title prop
  small?: boolean; // Optional small prop
  className?: string; // Optional className prop
  containerClassName?: string; // Optional containerClassName prop
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  small,
  className,
  containerClassName,
}) => {
  return (
    <div
      className={`w-full ${small ? "max-w-md" : "max-w-screen-xl"} ${
        containerClassName ? containerClassName : ""
      }`}
    >
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      <div
        className={
          className ? className : "bg-white p-8 rounded-2xl shadow-lg w-full"
        }
      >
        <div className="text-secondary">{children}</div>
      </div>
    </div>
  );
};

export default Card;
