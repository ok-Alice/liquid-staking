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
      },
    },
  },
  plugins: [],
};

export default config;
