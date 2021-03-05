import type { Rule } from '../editor/parser'
import ExternalLink  from './blocks/ExternalLink.svelte'
import Link from "./blocks/Link.svelte";
import Tag from "./blocks/Tag.svelte";

import adapter from './adapter'

export default [
  {
    match: /#\[\[([^\]]+)\]\]/,
    processor(matched, position) {
      const page = adapter.writer.touchPageByTitle(matched[1]);
      return {
        type: "TAG",
        meta: {
          component: Tag,
          pageId: page.id,
          props: {
            title: matched[1],
          },
        },
        value: matched[1],
        matched,
        position,
      };
    },
  },
  {
    match: /#([^ ]+)/,
    processor(matched, position) {
      const page = adapter.writer.touchPageByTitle(matched[1]);
      return {
        type: "TAG",
        meta: {
          component: Tag,
          pageId: page.id,
          props: {
            title: matched[1],
          },
        },
        value: matched[1],
        matched,
        position,
      };
    },
  },
  {
    match: /\[\[([^\]]+)\]\]/,
    processor(matched, position) {
      const page = adapter.writer.touchPageByTitle(matched[1]);
      return {
        type: "LINK",
        meta: {
          component: Link,
          pageId: page.id,
          props: {
            title: matched[1],
          },
        },
        value: matched[1],
        matched,
        position,
      };
    },
  },
  {
    match: /\[([^\]]+)\]\(([^\)]+)\)/,
    processor(matched, position) {
      return {
        type: "ExternalLink",
        meta: {
          component: ExternalLink,
          props: {
            title: matched[1],
            url: matched[2],
          },
        },
        position,
        matched,
      };
    },
  },
] as Rule[];
