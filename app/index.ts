
import Main from './Main.svelte'


// const editor = new Editor({
//   target: document.querySelector("#app"),
//   props: {
//     pageId: "page",
//     adapter,
//     rules,
//   },
// });

const editor = new Main({
  target: document.querySelector("#app"),
});
