import type { Rule } from '../editor/parser'
import ExternalLink  from './blocks/ExternalLink.svelte'

export default [
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
