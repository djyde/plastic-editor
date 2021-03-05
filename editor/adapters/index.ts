import type { Block, Page, ShallowBlock } from "@plastic-editor/protocol/lib/protocol";


export type Note = {
  pages: Page[];
  blocks: { [key: string]: Block };
  stars?: string[];
};
export interface Writer {
  createNewBlock(
    pageId: string,
    blockId?: string,
    defaultContent?: string
  ): {
    block: Block;
    shallow: ShallowBlock;
  };
  createNewPage(title: string): Page;
  updateBlock(blockId: string, body): void;
  updatePage(pageId: string, page: Page);
  setBlockPageReferences(blockId: string, pageIds: string[])
  touchPageByTitle(title: string): Page;
}

export interface Reader {
  searchPageByKeyword(keyword: string): Page[];
  getPageById(pageId: string): Page | undefined;
  getBlockById(blockId: string): Block | undefined;

  output(): Note;
}

export interface Adapter {
  reader: Reader,
  writer: Writer
}
