import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full p-4 text-primary mt-auto">
      <div className="mx-auto max-w-screen-2xl flex justify-center items-center">
        <p className="text-center">
          &copy; {currentYear} OkAlice Liquid Staking Platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
