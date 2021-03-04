import type { Block, Page, ShallowBlock } from "@plastic-editor/protocol/lib/protocol";

export interface Writer {
  createNewBlock(
    pageId: string,
    blockId?: string,
    defaultContent?: string
  ): {
    block: Block;
    shallow: ShallowBlock
  };

  updateBlock(blockId: string, body): void
  updatePage(pageId: string, page: Page)
}

export interface Reader {
  searchPageByKeyword(keyword: string): Promise<Page[]>
  getPageById(pageId: string): Promise<Page>
  getBlockById(blockId: string): Promise<Block>
}

export interface Adapter {
  reader: Reader,
  writer: Writer
}
