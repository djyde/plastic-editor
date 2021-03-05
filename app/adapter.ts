import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import type { Adapter, Note } from "../editor/adapters";
import { nanoid } from "nanoid";
import groupBy from "lodash.groupby";
import { isStale } from './store'

const initialNote = {
  pages: [],
  blocks: {},
  stars: [],
} as Note;

function makeSteal() {
  isStale.set(true)
}

export class InMemoryAdapter implements Adapter {
  constructor(public note: Note = initialNote) {}

  reader = {
    searchPageByKeyword: (keyword: string) => {
      return this.note.pages.filter((_) =>
        _.title.match(new RegExp(`${keyword}`, "i"))
      );
    },
    findPageReferenceBlocks: (pageId: string) => {
      const blocks = Object.keys(this.note.blocks)
        .map((blockId) => {
          if (this.note.blocks[blockId].references.indexOf(pageId) !== -1) {
            return this.note.blocks[blockId];
          }
        })
        .filter(Boolean);
      return groupBy(blocks, (_) => _.pageId) as { [key: string]: Block[] };
    },
    getBlockById: (blockId: string) => {
      return this.note.blocks[blockId];
    },

    getPageById: (pageId: string) => {
      return this.note.pages.find((_) => _.id === pageId);
    },

    getStaredPages: () => {
      return this.note.stars?.map((id) => this.reader.getPageById(id)) || [];
    },

    isStared: (pageId: string) => {
      return this.note.stars?.indexOf(pageId) !== -1;
    },

    output: () => {
      return this.note;
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

      this.note.blocks[block.id] = block;

      makeSteal();

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
      this.note.pages.push(page);


      makeSteal();
      return page;
    },

    updateBlock: (blockId: string, block: Block) => {
      this.note.blocks[blockId] = {
        ...this.note.blocks[blockId],
        ...block,
      };

      makeSteal();
    },

    updatePage: (pageId: string, page: Page) => {
      const pageIndex = this.note.pages.findIndex((_) => _.id === pageId);
      if (pageIndex !== -1) {
        this.note.pages[pageIndex] = page;
      }
      makeSteal();
    },

    setBlockPageReferences: (blockId: string, pageIds: string[]) => {
      this.note.blocks[blockId].references = pageIds;
    },

    touchPageByTitle: (title: string, meta?) => {
      const existed = this.note.pages.find((_) => _.title === title);
      if (!existed) {
        const created = this.writer.createNewPage(title, meta);
        makeSteal();
        return created
      } else {
        return existed;
      }
    },

    starPage: (pageId: string) => {
      if (this.note.stars?.findIndex((_) => _ === pageId) === -1) {
        this.note.stars.push(pageId);
      }
      makeSteal();
    },

    unstarPage: (pageId: string) => {
      this.note.stars = this.note.stars?.filter((_) => _ !== pageId) || [];
      makeSteal();
    },
  };

  stringify() {
    return JSON.stringify(
      {
        pages: this.note.pages,
        blocks: this.note.blocks,
      },
      null,
      2
    );
  }
}


export default new InMemoryAdapter()

