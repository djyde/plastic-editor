import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import type { Adapter } from ".";
import { nanoid } from 'nanoid'

export class InMemoryAdapter implements Adapter {
  constructor(private pages: Page[], private blocks: { [key: string]: Block }) {

  }

  reader = {
    searchPageByKeyword: async (keyword: string) => {
      return this.pages.filter(_ => _.title.match(new RegExp(`${keyword}`)))
    },
    getBlockById: async (blockId: string) => {
      return this.blocks[blockId];
    },
    getPageById: async (pageId: string) => {
      return this.pages.find(_ => _.id === pageId)
    },
  };

  writer = {
    createNewBlock: (pageId: string, blockId?: string, defaultContent?: string) => {
      const block = {
        id: blockId || nanoid(8),
        content: defaultContent || "",
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
    },

    updateBlock: (blockId: string, block: Block) => {
      this.blocks[blockId] = {
        ...this.blocks[blockId],
        ...block
      }
    },
    
    updatePage: (pageId: string, page: Page) => {
      const pageIndex = this.pages.findIndex(_ => _.id === pageId)
      if (pageIndex !== -1) {
        this.pages[pageIndex] = page
      }
    }
  }

  stringify() {
    return JSON.stringify({
      pages: this.pages,
      blocks: this.blocks
    }, null, 2)
  }
}
