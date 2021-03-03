import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import type { Adapter } from ".";
import { nanoid } from 'nanoid'

export class InMemoryAdapter implements Adapter {
  constructor(private pages: Page[], private blocks: { [key: string]: Block }) {

  }

  reader = {
    getBlockById: async (blockId: string) => {
      return this.blocks[blockId];
    },
    getPageById: async (pageId: string) => {
      return this.pages.find(_ => _.id === pageId)
    },
  };

  writer = {
    createNewBlock: (pageId: string, blockId?: string) => {
      const block = {
        id: blockId || nanoid(8),
        content: "",
        pageId: pageId,
        references: [],
      } as Block;

      this.blocks[block.id] = block

      return {
        block,
        shallow: {
          id: block.id,
          children: []
        }
      }
    }
  }
}
