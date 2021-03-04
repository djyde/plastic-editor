import type { Block, Page, ShallowBlock } from "@plastic-editor/protocol/lib/protocol";

export interface Writer {
  createNewBlock(
    pageId: string,
    blockId?: string
  ): {
    block: Block;
    shallow: ShallowBlock
  };
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
