import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";

export default {
  root: './app',
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
  ],
  build: {
    outDir: 'public',
    rollupOptions: {

    },
  },
};
