import { pinyin } from "pinyin-pro";

export const initialGen = (
  chinese: string | string[],
  options = {
    splitter: ",",
    toUpperCase: true,
  },
) => {
  const { splitter, toUpperCase } = options;
  const wordList = Array.isArray(chinese) ? chinese : [chinese];
  const pinyinOptions = { pattern: "first", multiple: true } as const;

  const initial = wordList
    .map(
      (word) => pinyin(word.at(0)!, pinyinOptions), // "h x"
    ) // [ "h x", "b f" ]
    .join(" ") // "h x b f"
    .replaceAll(" ", splitter); // "h,x,b,f"

  if (!toUpperCase) {
    return initial;
  }

  const upperCase = initial.toUpperCase();

  return `${initial},${upperCase}`; // h,x,b,f,H,X,B,F
};
