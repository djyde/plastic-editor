import type { Block, Page, ShallowBlock } from "@plastic-editor/protocol/lib/protocol";

export type Note = {
  blocks: { [key: string]: Block };
  pages: Page[];
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
  searchPageByKeyword(keyword: string): Promise<Page[]>
  getPageById(pageId: string): Promise<Page>
  getBlockById(blockId: string): Promise<Block>

  output(): Note
}

export interface Adapter {
  reader: Reader,
  writer: Writer
}
