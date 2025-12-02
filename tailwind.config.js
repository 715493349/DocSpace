/** @type {import('tailwindcss').Config} */
module.exports = {
  // 关键：确保包含所有使用 Tailwind 工具类的文件路径
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 扫描 src 下所有子文件夹的 js/jsx/ts/tsx 文件
    "./src/components/**/*.{js,jsx,ts,tsx}", // 显式指定 components 文件夹（冗余但保险）
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
