module.exports = {
  plugins: {
    tailwindcss: {
      purge: ["src/**/*.svelte", "index.html", "demo/**/*.svelte"],
    },
    autoprefixer: {},
  },
};
