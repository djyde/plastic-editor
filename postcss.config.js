module.exports = {
  plugins: {
    tailwindcss: {
      purge: [
        "editor/**/*.svelte",
        "index.html",
        "app/**/*.svelte",
        "app/index.html",
      ],
    },
    autoprefixer: {},
  },
};
