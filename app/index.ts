
import Entry from './Entry.svelte'
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
  // await db.init()
  const editor = new Entry({
    target: document.querySelector("#app"),
  });
})()