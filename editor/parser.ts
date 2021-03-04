import builtinRules from './rules'

export type Token = {
  type: string;
  position: number;
  matched: RegExpMatchArray;
  meta?: any;
  value: string;
};

export type Rule = {
  match: RegExp;
  processor(matched: RegExpMatchArray, position: number): Token;
};

export function tokenizer(str: string, rules: Rule[]) {
  let matches = builtinRules.concat(rules);
  let position = 0;
  let toMatch = str;
  let tokens = [] as Token[];

  let text: string | null = null;

  whileLoop: while (toMatch.length > 0) {
    let matched: RegExpMatchArray;
    for (const rule of matches) {
      if ((matched = toMatch.match(new RegExp(`^${rule.match.source}`)))) {
        toMatch = toMatch.slice(matched[0].length);
        // clear plain
        if (text !== null) {
          // @ts-expect-error
          tokens.push({
            type: "TEXT",
            value: text,
            position,
          });
          position += text.length;
          text = null;
        }

        tokens.push(rule.processor(matched, position));

        position += matched[0].length;

        continue whileLoop;
      }
    }

    text !== null ? (text += toMatch[0]) : (text = toMatch[0]);
    toMatch = toMatch.slice(1);
  }

  if (text !== null) {
    // @ts-expect-error
    tokens.push({
      type: "TEXT",
      value: text,
      position,
    });
    position += text.length;
  }

  return tokens;
}
