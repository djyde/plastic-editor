import type { Rule } from '../editor/parser'
import ExternalLink  from './blocks/ExternalLink.svelte'
import Link from "./blocks/Link.svelte";

export default [
  {
    match: /\[\[([^\]]+)\]\]/,
    processor(matched, position) {
      return {
        type: "LINK",
        meta: {
          component: Link,
          props: {
            title: matched[1]
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
