// @ts-expect-error
import Editor  from './src/Editor.svelte'
import type { Block, Page } from '@plastic-editor/protocol/lib/protocol'
import { InMemoryAdapter } from './src/adapters/InMemory'

const page = {
  id: "page",
  title: "page",
  children: [
    {
      id: "block1",
      children: [],
    },
    {
      id: "block2",
      children: [
        {
          id: "block3",
          children: [
            {
              id: "block5",
              children: [],
            },
          ],
        },
        {
          id: "block4",
          children: [],
        },
      ],
    },
  ],
} as Page;

const blocks = {
  block1: {
    id: "block1",
    content: "block1",
    references: [],
    pageId: "page",
  },
  block2: {
    id: "block2",
    content: "block2",
    references: [],
    pageId: "page",
  },
  block3: {
    id: "block3",
    content: "block3",
    references: [],
    pageId: "page",
  },
  block4: {
    id: "block4",
    content: "block4",
    references: [],
    pageId: "page",
  },
  block5: {
    id: "block5",
    content: "block5",
    references: [],
    pageId: "page",
  },
} as { [key: string]: Block };

const editor = new Editor({
  target: document.querySelector("#app"),
  props: {
    pageId: 'page',
    adapter: new InMemoryAdapter([page], blocks)
  }
})

