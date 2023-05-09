import { describe, expect, it } from "vitest";
import * as t from "./tree.js";
import * as h from "./human.js";

describe("Path Tree", () => {
  // a "terminal" is leaf node with something "interesting" (presumable a file
  // or other content); an "intermediary" is similar to a directory or container
  // of files
  interface Terminal {
    readonly path: string;
  }
  interface Intermediary {
    readonly friendlyName: string;
  }

  const home: Terminal = {
    path: "home",
  };

  const root2: Terminal = {
    path: "root2",
  };

  const module1: Terminal = {
    path: "home/module1",
  };

  const m1Component1: Terminal = {
    path: "home/module1/component1",
  };

  const module2: Terminal = {
    path: "home/module2",
  };

  const m2Component1: Terminal = {
    path: "home/module2/component1",
  };

  const m2Component1Service1: Terminal = {
    path: "home/module2/component1/service1",
  };

  // the next two are examples of "intermediaries" (`-i`) which are similar to
  // directories in which the directory has no content but has more sub directories

  const m3Component1Service1: Terminal = {
    path: "home/module3-i/component1-i/service1-t",
  };

  const m3Component1Service2: Terminal = {
    path: "home/module3-i/component1-i/service2-t",
  };

  it("populates path tree from generator", () => {
    const tree = t.pathTree<Terminal, Intermediary>(
      function* () {
        yield home;
        yield root2;
        yield module1;
        yield m1Component1;
        yield module2;
        yield m2Component1;
        yield m2Component1Service1;
        yield m3Component1Service1;
        yield m3Component1Service2;
      },
      (ts) => ts.terminal.path.split("/"),
      (node) => ({
        ...node,
        intermediary: {
          friendlyName: h.humanFriendlyPhrase(node.qualifiedPath),
        },
      }),
    );

    const nodes = t.pathTreeNodesList(tree, () => true);

    expect(nodes.length).toBe(11);
    expect(
      nodes.map((n) => [n.qualifiedPath, n.level, n.intermediary]),
    ).toEqual([
      ["home", 0, undefined],
      ["root2", 0, undefined],
      ["home/module1", 1, undefined],
      ["home/module2", 1, undefined],
      ["home/module3-i", 1, { friendlyName: "Home Module3 I" }],
      ["home/module1/component1", 2, undefined],
      ["home/module2/component1", 2, undefined],
      ["home/module2/component1/service1", 3, undefined],
      [
        "home/module3-i/component1-i",
        2,
        { friendlyName: "Home Module3 I Component1 I" },
      ],
      ["home/module3-i/component1-i/service1-t", 3, undefined],
      ["home/module3-i/component1-i/service2-t", 3, undefined],
      // ["", , undefined],
    ]);

    const homeNode = tree.children[0];
    expect(homeNode?.unit).toBe("home");

    const m2Component1Service1Node = t.selectTreeNode(
      homeNode!,
      "module2/component1/service1",
    );
    expect(
      m2Component1Service1Node?.ancestors.map((n) => [
        n.qualifiedPath,
        n.level,
      ]),
    ).toEqual([
      ["home/module2/component1", 2],
      ["home/module2", 1],
      ["home", 0],
    ]);
  });

  it("populates path tree from array", () => {
    const tree = t.pathTree<Terminal, Intermediary>(
      [
        home,
        root2,
        module1,
        m1Component1,
        module2,
        m2Component1,
        m2Component1Service1,
      ],
      (ts) => ts.terminal.path.split("/"),
      (node) => ({
        ...node,
        intermediary: {
          friendlyName: h.humanFriendlyPhrase(node.qualifiedPath),
        },
      }),
    );

    const nodes = t.pathTreeNodesList(tree, () => true);

    expect(nodes.length).toBe(7);
    expect(nodes.map((n) => [n.qualifiedPath, n.level])).toEqual([
      ["home", 0],
      ["root2", 0],
      ["home/module1", 1],
      ["home/module2", 1],
      ["home/module1/component1", 2],
      ["home/module2/component1", 2],
      ["home/module2/component1/service1", 3],
    ]);

    const homeNode = tree.children[0];
    expect(homeNode?.unit).toBe("home");

    const m2Component1Service1Node = t.selectTreePath(
      tree,
      "home/module2/component1/service1",
    );
    expect(
      m2Component1Service1Node?.ancestors.map((n) => [
        n.qualifiedPath,
        n.level,
      ]),
    ).toEqual([
      ["home/module2/component1", 2],
      ["home/module2", 1],
      ["home", 0],
    ]);
  });
});

describe("relational rows to tree", () => {
  it("populates path tree from array", () => {
    const rows = [
      { id: "1", name: "name 1", parentId: undefined },
      { id: "2", name: "name 2", parentId: undefined },
      { id: "2_1", name: "name 2_1", parentId: "2" },
      { id: "2_2", name: "name 2_2", parentId: "2" },
      { id: "3", name: "name 3", parentId: undefined },
      { id: "4", name: "name 4", parentId: undefined },
      { id: "5", name: "name 5", parentId: undefined },
      { id: "6", name: "name 6", parentId: undefined },
      { id: "7", name: "name 7", parentId: undefined },
      { id: "1_1", name: "name 1_1", parentId: "1" },
      { id: "1_2", name: "name 1_2", parentId: "1" },
      { id: "1_3", name: "name 1_3", parentId: "1" },
      { id: "1_4", name: "name 1_4", parentId: "1" },
      { id: "1_5", name: "name 1_5", parentId: "1" },
      { id: "2_1_1", name: "name 2_1_1", parentId: "2_1" },
      { id: "2_1_2", name: "name 2_1_2", parentId: "2_1" },
      { id: "2_1_3", name: "name 2_1_3", parentId: "2_1" },
      { id: "2_1_4", name: "name 2_1_4", parentId: "2_1" },
      { id: "2_1_5", name: "name 2_1_5", parentId: "2_1" },
    ];

    const tree = t.treeOf(rows);
    expect(tree).toEqual([
      {
        id: "1",
        name: "name 1",
        parentId: undefined,
        children: [
          {
            id: "1_1",
            name: "name 1_1",
            parentId: "1",
            children: [],
          },
          {
            id: "1_2",
            name: "name 1_2",
            parentId: "1",
            children: [],
          },
          {
            id: "1_3",
            name: "name 1_3",
            parentId: "1",
            children: [],
          },
          {
            id: "1_4",
            name: "name 1_4",
            parentId: "1",
            children: [],
          },
          {
            id: "1_5",
            name: "name 1_5",
            parentId: "1",
            children: [],
          },
        ],
      },
      {
        id: "2",
        name: "name 2",
        parentId: undefined,
        children: [
          {
            id: "2_1",
            name: "name 2_1",
            parentId: "2",
            children: [
              {
                id: "2_1_1",
                name: "name 2_1_1",
                parentId: "2_1",
                children: [],
              },
              {
                id: "2_1_2",
                name: "name 2_1_2",
                parentId: "2_1",
                children: [],
              },
              {
                id: "2_1_3",
                name: "name 2_1_3",
                parentId: "2_1",
                children: [],
              },
              {
                id: "2_1_4",
                name: "name 2_1_4",
                parentId: "2_1",
                children: [],
              },
              {
                id: "2_1_5",
                name: "name 2_1_5",
                parentId: "2_1",
                children: [],
              },
            ],
          },
          {
            id: "2_2",
            name: "name 2_2",
            parentId: "2",
            children: [],
          },
        ],
      },
      {
        id: "3",
        name: "name 3",
        parentId: undefined,
        children: [],
      },
      {
        id: "4",
        name: "name 4",
        parentId: undefined,
        children: [],
      },
      {
        id: "5",
        name: "name 5",
        parentId: undefined,
        children: [],
      },
      {
        id: "6",
        name: "name 6",
        parentId: undefined,
        children: [],
      },
      {
        id: "7",
        name: "name 7",
        parentId: undefined,
        children: [],
      },
    ]);
  });
});
