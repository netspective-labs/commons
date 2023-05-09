# Universal libraries

Libraries and modules that can work across projects (Astro or any other Typescript / NodeJS packages).

## Remark Markdown processor plugins

To add features to Markdown refer to [this guide](https://www.ryanfiller.com/blog/remark-and-rehype-plugins) among others.

- `rewrite-links.mjs` allows rewriting links based on variables or any other custom function.
- `diagram.mjs` converts `markmap` and `mermaid` code blocks to their `<div class="mermaid">` counterparts.
- `reading-time.mjs` gueses reading time for the content
- `transform-img-preview-src.ts` allows images to be either co-located or relatively referenced and automatically rewritten to be web publishable
- `validate-resources.ts` TODO implement to test whether links `href` and images `src` are valid (TODO: see if remark lint utilities will work better?)

TODO: need to add unit tests for all the remark plugins.
