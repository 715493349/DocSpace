// 正确的配置（替换旧配置）
module.exports = {
  plugins: {
    // 替换原来的 'tailwindcss' 为 '@tailwindcss/postcss'
    "@tailwindcss/postcss": {},
    autoprefixer: {}, // 保持autoprefixer（如果之前有配置）
  },
};
