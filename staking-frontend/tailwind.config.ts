import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#34495E", // Default shade for primary
        "primary-500": "#34495E",
        "primary-700": "#2C3E50", // Darker shade of primary color

        secondary: "#7F8C8D", // Default shade for secondary
        "secondary-500": "#7F8C8D",
        "secondary-700": "#707B7C", // Darker shade of secondary color

        lightblue: "#cce2e8", // Default shade for lightblue
        "lightblue-500": "#cce2e8",
        "lightblue-700": "#b0ced7", // Darker shade of lightblue color

        // New colors for notifications
        success: "#2ecc71", // Default shade for success
        "success-500": "#2ecc71",
        "success-700": "#27ae60", // Darker shade for success

        warning: "#e67e22", // Default shade for warning
        "warning-500": "#e67e22",
        "warning-700": "#d35400", // Darker shade for warning

        error: "#e74c3c", // Default shade for error
        "error-500": "#e74c3c",
        "error-700": "#c0392b", // Darker shade for error
      },
    },
  },
  plugins: [],
};

export default config;
