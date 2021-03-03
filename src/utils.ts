export function isInBracket(str: string, position: number) {
  const reg = /\[\[([^\]]+)\]\]/g;
  // +-2 is the offset of `[[` and `]]`
  // @ts-expect-error
  const ranges = Array.from(str.matchAll(reg)).map(
    (_: any) => [_.index + 2, _.index + _[0].length - 2] as number[]
  );
  return ranges.find(([start, end]) => {
    return position >= start && position <= end;
  });
}
