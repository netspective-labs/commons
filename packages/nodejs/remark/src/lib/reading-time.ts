import type { ReadTimeResults } from "reading-time";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";

interface Data {
  astro: {
    frontmatter: {
      minutesRead?: string;
    };
  };
}

export function remarkReadingTime(): Plugin<[options?: { data: Data }]> {
  return function (
    tree,
    { data }: { data: Data } = { data: { astro: { frontmatter: {} } } },
  ) {
    const textOnPage = toString(tree);
    const readingTime: ReadTimeResults = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
