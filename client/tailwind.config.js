// /** @type {import('tailwindcss').Config} */

// const flowbite = require("flowbite-react/tailwind");

// module.exports = {
//   content: [["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], flowbite.content()],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     // ...
//     flowbite.plugin(),
//     require("tailwind-scrollbar"),
//     require("@tailwindcss/line-clamp"),
//   ],
// };
/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // ...
    flowbite.plugin(),
    require("tailwind-scrollbar"),
    // Remove the line-clamp plugin as it's included by default
    // require("@tailwindcss/line-clamp"),
  ],
};
