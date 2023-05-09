/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFriendlyBytes(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Replace all special characters (non-letters/numbers) with space and
 * capitalize the first character of each word.
 * @param text string with special characters (like a filename or slug)
 */
export function humanFriendlyPhrase(text: string) {
  // first replace all special characters with space then remove multiple spaces
  return text
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s\s+/g, " ")
    .replace(
      // ^\w{1} matches the first letter of the word.
      //   ^ matches the beginning of the string.
      //   \w matches any word character.
      //   {1} takes only the first character.
      // | works like the boolean OR. It matches the expression after and before the |.
      // \s+ matches any amount of whitespace between the words.
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase(),
    );
}

/**
 * humanPath shortens a potentially long slash-delimited path into a short one
 * by keeping as much of the starting and ending paths (which are important
 * for humans).
 * @param original the text we want to humanize
 * @param maxLength the number of characters to keep at start + end
 * @param formatBasename an optional function which should be called to format the basename
 * @returns the string shortened to maxLength and formatted with
 */
export const humanPath = (
  original: string,
  maxLength = 50,
  formatBasename?: (basename: string) => string,
) => {
  const tokens = original.split("/");
  const basename = tokens[tokens.length - 1] ?? "";

  //remove first and last elements from the array
  tokens.splice(0, 1);
  tokens.splice(tokens.length - 1, 1);

  if (original.length < maxLength) {
    return (
      (tokens.length > 0 ? tokens.join("/") + "/" : "") +
      (formatBasename ? formatBasename(basename) : basename)
    );
  }

  //remove the current lenth and also space for 3 dots and slash
  const remLen = maxLength - basename.length - 4;
  if (remLen > 0) {
    //recreate our path
    const path = tokens.join("/");
    //handle the case of an odd length
    const lenA = Math.ceil(remLen / 2);
    const lenB = Math.floor(remLen / 2);
    //rebuild the path from beginning and end
    const pathA = path.substring(0, lenA);
    const pathB = path.substring(path.length - lenB);
    return (
      pathA +
      "..." +
      pathB +
      "/" +
      (formatBasename ? formatBasename(basename) : basename)
    );
  }
  return formatBasename ? formatBasename(basename) : basename;
};
