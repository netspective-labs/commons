import { z } from "zod";
import { JSDOM } from "jsdom";
import domPurifyFactory from "dompurify";
import { Readability } from "@mozilla/readability";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export const foreignContentSchema = z
  .object({
    url: z.string(), // should have .transform(text => new URL(text)) but Astro broke so we're using string not URL
    content: z
      .object({
        selectAll: z.string().optional(),
        selectFirst: z.string().optional(),
        onSelectFail: z.string().default("SELECT FAILED").optional(),
        unsanitized: z.boolean().optional(),
        readable: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type ForeignContent = z.infer<typeof foreignContentSchema>;

/**
 * Given a URL, create a JSDOM instance that allows querying of HTML as it would
 * be done in a browser. No sanitization is done.
 * @param url the URL to load
 * @returns JSDOM instance
 */
export async function queryableContent(url: string) {
  return await JSDOM.fromURL(url);
}

/**
 * Given a URL, create a JSDOM instance that allows querying of HTML as it would
 * be done in a browser. Potential XSS/JS is stripped using DOMPurify library.
 * @param url the URL to load
 * @returns JSDOM instance with sanitized HTML
 */
export async function queryableSanitizedContent(url: string) {
  const unsanitizedDOM = await JSDOM.fromURL(url);
  const udHTML = unsanitizedDOM.serialize();

  // strip potential XSS/JS in the article using DOMPurify library
  const domPurify = domPurifyFactory(unsanitizedDOM.window as Any); // TODO: fix "as any" caste
  const sanitizedHTML = domPurify.sanitize(udHTML);
  return new JSDOM(sanitizedHTML, { url });
}

export async function readableContent(url: string) {
  const unsanitizedDOM = await JSDOM.fromURL(url);
  const udHTML = unsanitizedDOM.serialize();

  // strip potential XSS/JS in the article using DOMPurify library
  const domPurify = domPurifyFactory(unsanitizedDOM.window as Any); // TODO: fix "as any" caste
  const sanitizedHTML = domPurify.sanitize(udHTML);
  const sanitizedDOM = new JSDOM(sanitizedHTML, { url });

  // parse out the Article body text using Readability library
  const reader = new Readability(sanitizedDOM.window.document);
  const result = reader.parse();

  // TODO:
  // - [ ] Strip leading and trailing whitespace
  // 	if (article['textContent'] !== null) {
  // 		article['textContent'] = article['textContent'].trim()
  // 	}

  // - [ ] Attach information about original source charset to output
  // 	const charset = dom.window.document.characterSet || sanitizedDOM.window.document.characterSet
  // 	article['charset'] = charset

  // - [ ] Proper handling of windos-1252 content
  // 	if (article['content'] !== null && charset !== 'windows-1252') {
  // 		// prepend meta charset tag to html to hint to downstream renderers to use the correct original encoding
  // 		article['content'] = `<meta charset="${charset}">\n${article['content']}`
  // 	}

  return result;
}
