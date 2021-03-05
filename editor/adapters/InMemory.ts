import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import type { Adapter } from ".";
import { nanoid } from 'nanoid'
import groupBy from 'lodash.groupby'

type Note = {
  pages: Page[];
  blocks: { [key: string]: Block };
};

export class InMemoryAdapter implements Adapter {
  constructor(
    public pages: Page[] = [],
    public blocks: { [key: string]: Block } = {}
  ) {}

  reader = {
    searchPageByKeyword: async (keyword: string) => {
      return this.pages.filter((_) =>
        _.title.match(new RegExp(`${keyword}`, "i"))
      );
    },
    findPageReferenceBlocks: (pageId: string) => {
      const blocks = Object.keys(this.blocks).map(blockId => {
        if (this.blocks[blockId].references.indexOf(pageId) !== -1) {
          return this.blocks[blockId]
        }
      }).filter(Boolean)
      return groupBy(blocks, _ => _.pageId) as {[key: string]: Block[]}
    },
    getBlockById: async (blockId: string) => {
      return this.blocks[blockId];
    },
    getPageById: async (pageId: string) => {
      return this.pages.find((_) => _.id === pageId);
    },
    output: () => {
      return {
        pages: this.pages,
        blocks: this.blocks,
      };
    },
  };

  writer = {
    createNewBlock: (
      pageId: string,
      blockId?: string,
      defaultContent?: string
    ) => {
      const block = {
        id: blockId || nanoid(8),
        content: defaultContent || "",
        pageId: pageId,
        references: [],
      } as Block;

      this.blocks[block.id] = block;

      return {
        block,
        shallow: {
          id: block.id,
          children: [],
        },
      };
    },

    createNewPage: (title: string, meta?) => {
      const id = nanoid(8);
      const page = {
        id,
        title,
        ...meta,
        children: [this.writer.createNewBlock(id).shallow],
      } as Page;
      this.pages.push(page);
      return page;
    },

    updateBlock: (blockId: string, block: Block) => {
      this.blocks[blockId] = {
        ...this.blocks[blockId],
        ...block,
      };
    },

    updatePage: (pageId: string, page: Page) => {
      const pageIndex = this.pages.findIndex((_) => _.id === pageId);
      if (pageIndex !== -1) {
        this.pages[pageIndex] = page;
      }
    },

    setBlockPageReferences: (blockId: string, pageIds: string[]) => {
      this.blocks[blockId].references = pageIds
    },

    touchPageByTitle: (title: string, meta?) => {
      const existed = this.pages.find(_ => _.title === title );
      if (!existed) {
        return this.writer.createNewPage(title, meta);
      } else {
        return existed;
      }
    }
  };

  stringify() {
    return JSON.stringify(
      {
        pages: this.pages,
        blocks: this.blocks,
      },
      null,
      2
    );
  }
}
