import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import path from 'path'

export default {
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
  ],
  build: {
    rollupOptions: {},
    lib: {
      entry: path.resolve(__dirname, './src/Editor.svelte'),
      name: 'PlasticEditor'
    }
  },
};
