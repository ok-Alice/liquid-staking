import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React from "react";

interface DropDownAction {
  text: string;
  onClick: () => void;
}

interface DropdownButtonProps {
  icon?: FontAwesomeIconProps["icon"];
  text: React.ReactNode;
  dropdownHeader?: React.ReactNode;
  dropdownActions?: DropDownAction[];
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  icon,
  text,
  dropdownHeader,
  dropdownActions,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action: DropDownAction) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-200 bg-gray-100"
          onClick={handleButtonClick}
        >
          {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
          <span>{text}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`transform ${
              isOpen ? "rotate-180 -mt-1" : ""
            } -mr-1 ml-2 h-5 w-5 mt-1`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 max-w-lg rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {dropdownHeader && (
              <div className="px-4 py-2 text-sm text-gray-700">
                {dropdownHeader}
              </div>
            )}

            {!!dropdownActions &&
              dropdownActions.map((action: DropDownAction) => (
                <button
                  key={action.text}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 truncate"
                  onClick={() => handleActionClick(action)}
                >
                  {action.text}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
