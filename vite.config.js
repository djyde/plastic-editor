import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";

export default {
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
  ],
  build: {
    rollupOptions: {

    },
  },
};
