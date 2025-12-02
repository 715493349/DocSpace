module.exports = {
  plugins: {
    // 关键：替换原来的'tailwindcss'为'@tailwindcss/postcss'
    "@tailwindcss/postcss": {},
    autoprefixer: {}, // 保持autoprefixer，确保样式兼容性
  },
};
