
import Main from './Main.svelte'
import * as db from './db'

// const editor = new Editor({
//   target: document.querySelector("#app"),
//   props: {
//     pageId: "page",
//     adapter,
//     rules,
//   },
// });

;(async () => {
  await db.init()
  const editor = new Main({
    target: document.querySelector("#app"),
  });

})()