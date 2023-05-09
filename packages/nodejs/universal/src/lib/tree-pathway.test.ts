import { describe, expect, it } from "vitest";
import * as t from "./tree";
import * as tp from "./tree-pathway";
import * as h from "./human";

describe("Path Tree Node Pathway", () => {
  // a "terminal" is leaf node with something "interesting" (presumable a file
  // or other content); an "intermediary" is similar to a directory or container
  // of files
  interface Terminal {
    readonly path: string;
  }
  interface Intermediary {
    readonly friendlyName: string;
  }
  interface BreadcrumbUnit {
    readonly label: string;
    readonly slug: string;
  }

  it("populates path tree pathway from generator", () => {
    const tree = t.pathTree<Terminal, Intermediary>(
      function* () {
        yield { path: "home" };
        yield { path: "root2" };
        yield { path: "home/module1" };
        yield { path: "home/module1/component1" };
        yield { path: "home/module2" };
        yield { path: "home/module2/component1" };
        yield { path: "home/module2/component1/service1" };

        // the next two are examples of "intermediaries" (`-i`) which are similar to
        // directories in which the directory has no content but has more sub directories
        yield {
          path: "home/module3-i/component1-i/service1-t",
        };
        yield {
          path: "home/module3-i/component1-i/service2-t",
        };
      },
      (ts) => ts.terminal.path.split("/"),
      (node) => ({
        ...node,
        intermediary: {
          friendlyName: h.humanFriendlyPhrase(node.qualifiedPath),
        },
      }),
    );

    const bcUnit: tp.TreePathwayUnitSupplier<
      Terminal,
      Intermediary,
      BreadcrumbUnit
    > = (node) => ({
      label: node.unit,
      slug: node.qualifiedPath,
    });

    const prepareBreadcrumbs1 = tp.treePathwaysPreparer(tree, bcUnit, bcUnit, {
      includeTerminal: bcUnit,
    });
    expect(prepareBreadcrumbs1).toBeDefined();
    const breadcrumbs1 = prepareBreadcrumbs1.byNodeKey(
      "home/module2/component1/service1",
    );
    expect(breadcrumbs1).toStrictEqual([
      { label: "home", slug: "home" },
      { label: "module2", slug: "home/module2" },
      { label: "component1", slug: "home/module2/component1" },
      {
        label: "service1",
        slug: "home/module2/component1/service1",
      },
    ]);

    const prepareBreadcrumbs2 = tp.treePathwaysPreparer(tree, bcUnit, bcUnit, {
      refine: (pathway) => {
        pathway.unshift({
          label: "special-prefix",
          slug: "prefix",
        });
        pathway.push({
          label: "special-suffix",
          slug: "suffix",
        });
        return pathway;
      },
    });
    expect(prepareBreadcrumbs1).toBeDefined();
    const homeNode = tree.children[0];
    const m2Component1Service1Node = t.selectTreeNode(
      homeNode!,
      "module2/component1/service1",
    );
    const breadcrumbs2 = prepareBreadcrumbs2.byNode(m2Component1Service1Node!);
    expect(breadcrumbs2).toStrictEqual([
      { label: "special-prefix", slug: "prefix" },
      { label: "home", slug: "home" },
      { label: "module2", slug: "home/module2" },
      { label: "component1", slug: "home/module2/component1" },
      { label: "special-suffix", slug: "suffix" },
    ]);
  });
});
