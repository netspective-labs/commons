import type { Image, Link } from "mdast";
import type { MdxJsxFlowElement, MdxJsxAttribute } from "mdast-util-mdx-jsx";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export const typicalTransformRelativePublicSrcAbsUrlWithoutPublicFn = () => {
  const startsWithDotDotSlash = (path: string) => {
    const c1 = path[0];
    const c2 = path[1];
    const c3 = path[2];
    return c1 === "." && c2 === "." && c3 === "/";
  };

  const relativePublic = "../public";
  const relativePublicLen = relativePublic.length;
  return (url: string): string | false => {
    if (!startsWithDotDotSlash(url)) return false;
    const relativePublicIdx = url.indexOf(relativePublic);
    return relativePublicIdx >= 0
      ? url.slice(relativePublicIdx + relativePublicLen)
      : false;
  };
};
export const typicalTransformRelativePublicSrcAbsUrlWithoutPublic =
  typicalTransformRelativePublicSrcAbsUrlWithoutPublicFn();

export interface RelocationPaths {
  readonly colocatedNodeUrlAbsFileName: string;
  readonly relocatableFsPublicNodeUrlAbsPath: string;
  readonly relocatableFsPublicNodeUrlAbsFileName: string;
  readonly relocatableFsPublicNodeUrlRelFileName: string;
  readonly relocatedPublicNodeURL: string;
}

/**
 * We want to be able to co-locate images with Markdown during editing so that
 * they are previewable and convenient to manage. However, during builds of
 * static sites or apps we want the same images to be available in the `public`
 * directory so that they can be served as web assets without worrying about
 * pretty URLs or locations. For example, this should be possible in Markdown:
 *
 * ![I'm a Colocated Link](colocated-file-name.jpg)
 * [Click Colocated Link](colocated-file-name.jpg)
 *
 * We we process remark and publish as SSG (e.g. Astro) we automatically figure
 * out the location of markdown source file to copy `colocated-file-name.jpg`
 * into `~/public/x/y/z/colocated-file-name.jpg` where x/y/z is the relative
 * path of the source.
 *
 * We also want to be able to store images directly in ~/public but our Markdown
 * files in `src/*` to be preview-friendly in the CLI and VS Code. For example,
 * this should be possible in Markdown:
 *
 * ![test](../../../public/assets-natural/brand/netspective/knowledge-center/knowledge-center-logo-full-161x35.png)
 * ![try](../../../public/assets-natural/brand/netspective/knowledge-center/knowledge-center-logo-full-161x35.png)
 *
 * When we process using remark and publish as SSG (e.g. Astro) we don't include
 * the path `/public` because that's just the `dist` folder (in any SSG). So, we
 * rewrite them dynamically to:
 *
 * ![test](/assets-natural/brand/netspective/knowledge-center/knowledge-center-logo-full-161x35.png)
 *
 * TODO: also consider the following features:
 * - A bare-word (something without a path) URL is searched automatically in the
 *   file system (like a $PATH) or looked-up using dictionary-backed function.
 *   Similar to how [[wiki]] links or zoxide file system navigator work.
 * - Support relative resources for reloctable resources such that an image or
 *   link could be above or below a Markdown file and still be found (currently
 *   we only support bare-word relocatable resources which are co-located).
 * - [embed local images as data URIs](https://github.com/remarkjs/remark-embed-images)
 * - [inlines SVG images](https://github.com/alvinometric/remark-inline-svg)
 *
 * @returns a remark plugin function which rewrites previewable image URLs to publish-friendly
 */
export function remarkRewritePreviewableURLs(options?: {
  readonly transformURLs?: {
    readonly isEnabled: boolean;
    readonly rewrittenURL: (
      url: string,
      vfile: VFile,
    ) => [url: string, terminate: boolean] | false;
  }[];
  readonly relocateResources?: {
    readonly isEnabled: boolean;
    readonly isColocated: (url: string, vfile: VFile) => boolean;
    readonly relocationPaths: (url: string, vfile: VFile) => RelocationPaths;
    readonly relocate: (rp: RelocationPaths) => Promise<void>;
  };
}) {
  const { transformURLs, relocateResources: ci } = options ?? {};

  const prepareHandler = (node: { type: string }) => {
    switch (node.type) {
      case "link":
      case "image": {
        const linkOrImg = node as unknown as Link | Image;
        return {
          inspectURL: () => linkOrImg.url,
          rewriteURL: (rewrittenURL: string) => (linkOrImg.url = rewrittenURL),
        };
      }

      case "mdxJsxFlowElement": {
        const elem = node as unknown as MdxJsxFlowElement;
        switch (elem.name) {
          case "a": {
            const hrefAttr = elem.attributes.find(
              (a) => a.type == "mdxJsxAttribute" && a.name == "href",
            ) as MdxJsxAttribute | undefined;
            return {
              inspectURL: () => hrefAttr?.value as string | undefined,
              rewriteURL: (rewrittenURL: string) => {
                if (hrefAttr?.value) hrefAttr.value = rewrittenURL;
              },
            };
          }
          case "object": {
            const dataAttr = elem.attributes.find(
              (a) => a.type == "mdxJsxAttribute" && a.name == "data",
            ) as MdxJsxAttribute | undefined;
            return {
              inspectURL: () => dataAttr?.value as string | undefined,
              rewriteURL: (rewrittenURL: string) => {
                if (dataAttr?.value) dataAttr.value = rewrittenURL;
              },
            };
          }
        }
        return undefined;
      }

      // TODO: if we want to allow <object>, <embed>, etc. URL rewriting we'll have to handle it like this:
      // case "html":
      // 	const html = node as unknown as HTML;
      // 	if(html.value.startsWith("<object ")) {
      // 		// we'd have to manually parse and find attributes, etc.
      // 		// - type: 'html',
      // 		// - value: '<object type="image/svg+xml" data="_test.drawio.svg" width="680px">',
      // 	}
      // 	return undefined;

      default:
        return undefined;
    }
  };

  return () => {
    return async (tree: Any, vfile: VFile) => {
      const inspectedURLs = new Set<string>();
      const promises: Promise<Any>[] = [];
      if (typeof vfile?.path !== "string") return;

      visit(tree, (node: Image | Link) => {
        const handler = prepareHandler(node);
        if (!handler) return;

        const inspectURL = handler.inspectURL();
        if (!inspectURL) return;

        if (transformURLs) {
          for (const turl of transformURLs) {
            const rewrittenURL = turl.rewrittenURL(inspectURL, vfile);
            if (rewrittenURL) {
              const [url, terminate] = rewrittenURL;
              handler.rewriteURL(url);
              if (terminate) return;
            }
          }
        }

        if (ci && ci.isEnabled && ci.isColocated(inspectURL, vfile)) {
          const rp = ci.relocationPaths(inspectURL, vfile);
          handler.rewriteURL(rp.relocatedPublicNodeURL);
          if (!inspectedURLs.has(inspectURL)) {
            promises.push(ci.relocate(rp));
            inspectedURLs.add(inspectURL);
          }
        }
      });
      await Promise.all(promises);
    };
  };
}
