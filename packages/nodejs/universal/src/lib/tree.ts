/**
 * The "content" or "schema" of the terminal nodes in the path.
 */
export interface PathTreeTerminalSupplier<Terminal> {
  readonly terminal: Terminal;
}

/**
 * The "content" or "schema" of the intermediate nodes in the path.
 */
export interface PathTreeItermediarySupplier<Intermediary> {
  readonly intermediary: Intermediary;
}

/**
 * The nodes (children and descendants) of all nodes in the tree.
 */
export interface PathTree<Terminal, Intermediary> {
  readonly children: PathTreeNode<Terminal, Intermediary>[];
}

/**
 * A single 'unit' of a path tree's route.
 */
export interface PathTreeNode<Terminal, Intermediary>
  extends PathTree<Terminal, Intermediary>,
    Partial<PathTreeItermediarySupplier<Intermediary>>,
    Partial<PathTreeTerminalSupplier<Terminal>> {
  readonly unit: string;
  readonly qualifiedPath: string;
  readonly level: number;
  readonly parent?: PathTreeNode<Terminal, Intermediary> | undefined;
  readonly ancestors: PathTreeNode<Terminal, Intermediary>[];
  readonly children: PathTreeNode<Terminal, Intermediary>[];
}

/**
 * Given a path separator, provide a function that will determine the fully
 * qualified path of a given unit based on its parent and ancestors.
 * @param pathSep how path units are separated (default '/')
 * @returns a function that can be called like qp('/a/b/c', parent)
 */
export const qualifiedPathPreparer = <Terminal, Intermediary>(
  pathSep = "/",
) => {
  return (unit: string, parent?: PathTreeNode<Terminal, Intermediary>) =>
    parent?.qualifiedPath ? parent?.qualifiedPath + pathSep + unit : unit;
};

/**
 * Start at the current parent node and provide all children and their children.
 * @param parent the starting node
 */
export function* pathTreeDescendants<Terminal, Intermediary>(
  parent: PathTree<Terminal, Intermediary>,
): Generator<PathTreeNode<Terminal, Intermediary>> {
  for (const node of parent.children) {
    yield node;
    if (node.children.length > 0) yield* pathTreeDescendants(node);
  }
}

/**
 * Take the given terminal (leaf) unit instructions and create a hierarchy of
 * nodes to populate into owner
 * @param ts the instance which contains the "terminal" or leaf object (the "content" or "schema")
 * @param tree the root where the new node will be inserted
 * @param unitsSupplier function which prepares a list of units for the given ts
 * @returns
 */
export function populatePathTree<Terminal, Intermediary>(
  ts: PathTreeTerminalSupplier<Terminal>,
  tree: PathTree<Terminal, Intermediary>,
  unitsSupplier: (ts: PathTreeTerminalSupplier<Terminal>) => string[],
  intermediarySupplier: (
    ptn: Omit<PathTreeNode<Terminal, Intermediary>, "intermediary">,
    units: string[],
  ) => PathTreeNode<Terminal, Intermediary>,
  options?: {
    readonly qualifiedPathPreparer?: (
      unit: string,
      parent?: PathTreeNode<Terminal, Intermediary>,
    ) => string;
    readonly nodeExists?: (
      prospect: string,
      siblings: PathTreeNode<Terminal, Intermediary>[],
      ts: PathTreeTerminalSupplier<Terminal>,
    ) => PathTreeNode<Terminal, Intermediary> | undefined;
    readonly refineConstructed?: (
      suggested: PathTreeNode<Terminal, Intermediary>,
      ts: PathTreeTerminalSupplier<Terminal>,
      tree: PathTree<Terminal, Intermediary>,
    ) => PathTreeNode<Terminal, Intermediary>;
  },
): PathTreeNode<Terminal, Intermediary> | undefined {
  const nodeExists =
    options?.nodeExists ??
    ((prospect, siblings) => siblings.find((cn) => cn.unit == prospect));
  const nodeQualifiedPath =
    options?.qualifiedPathPreparer ?? qualifiedPathPreparer();
  const refineConstructed = options?.refineConstructed;
  const units = unitsSupplier(ts);
  const terminalIndex = units.length - 1;

  /**
   * Construct the tree node at the given level and place it as the last child
   * in collection.
   * @param level the "unit" level in owner's hierarchy
   * @param collection which children array to add the newly created node
   * @param ancestors the ancestors of the new node, starting at 0 for the parent and increment for each ancestor
   * @returns the newly created node
   */
  const createTreeNode = (
    level: number,
    collection: PathTreeNode<Terminal, Intermediary>[],
    ancestors: PathTreeNode<Terminal, Intermediary>[],
  ) => {
    // the first ancestor is the parent, second is grandparent, etc.
    const unit = units[level];
    let result = unit ? nodeExists(unit, collection, ts) : undefined;
    if (unit && !result) {
      const isTerminal = level == terminalIndex;
      const parent = ancestors.length > 0 ? ancestors[0] : undefined;
      const qualifiedPath = nodeQualifiedPath(unit, parent);
      result = {
        qualifiedPath,
        level,
        parent,
        ancestors,
        unit,
        children: [],
        terminal: (isTerminal ? ts.terminal : undefined) as Terminal,
      };
      if (!isTerminal) result = intermediarySupplier(result, units);
      if (refineConstructed) {
        result = refineConstructed(result, ts, tree);
      }
      collection.push(result);
    }
    // if we get to here the result is guaranteed to be non-null so let TS know
    return result!;
  };

  let treeItem: PathTreeNode<Terminal, Intermediary> | undefined;
  if (units.length > 0) {
    treeItem = createTreeNode(0, tree.children, []);

    const recurse = (
      level: number,
      ancestors: PathTreeNode<Terminal, Intermediary>[],
    ): PathTreeNode<Terminal, Intermediary> | undefined => {
      const parent = ancestors[0];
      if (parent && level < units.length) {
        const child = createTreeNode(level, parent.children, ancestors);
        return recurse(level + 1, [child, ...ancestors]);
      }
      return parent;
    };
    treeItem = recurse(1, [treeItem]);
  }
  return treeItem;
}

/**
 * Convert relative path to absolute
 * @param base the path that `relative` is relative to
 * @param relative the path relative to `base` (can be ./, ../.., etc.)
 * @returns
 */
export function absolutePath(base: string, relative: string, pathSep = "/") {
  const stack = base.split(pathSep);
  const parts = relative.split(pathSep);
  stack.pop(); // remove current file name (or empty string)
  // (omit if "base" is the current folder without trailing slash)
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] == ".") {
      continue;
    }
    if (parts[i] == "..") {
      stack.pop();
    } else {
      stack.push(parts[i]!);
    }
  }
  return stack.join(pathSep);
}

/**
 * Find the tree node matching 'query' in node and its children
 * @param node the node and children to search
 * @param query the path relative to `base` (can be ./, ../.., etc.)
 * @returns
 */
export function selectTreeNode<Terminal, Intermediary>(
  node: PathTreeNode<Terminal, Intermediary>,
  query: string | string[],
  options?: {
    readonly delim?: string;
    noMatch?: (
      endIndex: number,
      parseError?: boolean,
    ) => PathTreeNode<Terminal, Intermediary>;
  },
): PathTreeNode<Terminal, Intermediary> | undefined {
  const delim = options?.delim ?? "/";
  const noMatch = options?.noMatch;
  const path = [node, ...node.ancestors].reverse();
  let pathIndex = path.length - 1;
  let result: PathTreeNode<Terminal, Intermediary> | undefined = node;
  if (pathIndex < 0) return undefined;
  const parts = Array.isArray(query) ? query : query.split(delim);
  const lastPartsIndex = parts.length - 1;
  for (let i = 0; i < parts.length; i++) {
    const activePart = parts[i];
    if (activePart == "." || activePart == "") {
      continue;
    }
    if (activePart == "..") {
      pathIndex--;
      result =
        pathIndex >= 0 && pathIndex < path.length ? path[pathIndex] : undefined;
    } else {
      // a subdirectory is requested
      if (result?.children) {
        const child = result.children.find((n) => n.unit == activePart);
        if (child) {
          if (i < lastPartsIndex) {
            return selectTreeNode(
              child,
              parts.slice(i + 1).join(delim),
              options,
            );
          }
          return child;
        } else {
          return noMatch ? noMatch(pathIndex, true) : undefined;
        }
      } else {
        return noMatch ? noMatch(pathIndex, true) : undefined;
      }
    }
  }
  if (result) return result;
  return noMatch ? noMatch(pathIndex) : undefined;
}

/**
 * Find the tree node matching 'query' in tree and its descendants
 * @param tree the node and children to search
 * @param query the path relative to `base` (can be ./, ../.., etc.)
 * @returns
 */
export function selectTreePath<Terminal, Intermediary>(
  tree: PathTree<Terminal, Intermediary>,
  query: string,
  options?: {
    readonly delim?: string;
    noMatch?: (
      endIndex: number,
      parseError?: boolean,
    ) => PathTreeNode<Terminal, Intermediary>;
  },
) {
  const delim = options?.delim ?? "/";
  const queryParts = query.split(delim);
  if (queryParts.length > 0) {
    const startAt = queryParts[0];
    const startNode = tree.children.find((c) =>
      c.unit == startAt ? true : false,
    );
    if (startNode) {
      return selectTreeNode(startNode, queryParts.slice(1), options);
    }
  }
  return undefined;
}

/**
 * Traverse the tree and populate a flat array of all matching nodes
 * @param nodes The tree nodes to traverse
 * @param inspector The function to call for each node, return true to populate or false to skip node
 * @param populate The array to fill with nodes that inspector agrees to populate
 * @param level The current level being inspected
 * @param maxLevel Stop populating once the level reaches this maximum
 */
export function populatePathTreeNodes<Terminal, Intermediary>(
  nodes: { children: PathTreeNode<Terminal, Intermediary>[] },
  populate: PathTreeNode<Terminal, Intermediary>[],
  inspector?: (entry: PathTreeNode<Terminal, Intermediary>) => boolean,
  level = 0,
  maxLevel?: number,
): void {
  const filtered = inspector
    ? nodes.children.filter(inspector)
    : nodes.children;
  populate.push(...filtered);
  for (const node of filtered) {
    if (
      typeof maxLevel !== "number" ||
      (level <= maxLevel && node.children.length > 0)
    ) {
      populatePathTreeNodes(node, populate, inspector, level + 1, maxLevel);
    }
  }
}

/**
 * Traverse the tree and populate a flat array of all matching nodes
 * @param root the source tree
 * @param inspector The function to call for each node, return true to populate or false to skip node
 * @param maxLevel Stop populating once the level reaches this maximum
 * @returns a list of matching nodes
 */
export function pathTreeNodesList<Terminal, Intermediary>(
  root: PathTree<Terminal, Intermediary>,
  inspector?: (entry: PathTreeNode<Terminal, Intermediary>) => boolean,
  maxLevel?: number,
) {
  const result: PathTreeNode<Terminal, Intermediary>[] = [];
  populatePathTreeNodes(root, result, inspector, 0, maxLevel);
  return result;
}

/**
 * Traverse the tree and return a map of nodes
 * @param root the source tree
 * @param keySupplier The function to call for each node's key (defaults to qualifiedPath)
 * @param inspector The function to call for each node, return true to populate or false to skip node
 * @param maxLevel Stop populating once the level reaches this maximum
 * @returns a list of matching nodes
 */
export function pathTreeIndex<Terminal, Intermediary, Key = string>(
  root: PathTree<Terminal, Intermediary>,
  keySupplier?: (entry: PathTreeNode<Terminal, Intermediary>) => Key,
  inspector?: (entry: PathTreeNode<Terminal, Intermediary>) => boolean,
  maxLevel?: number,
) {
  const result: PathTreeNode<Terminal, Intermediary>[] = [];
  populatePathTreeNodes(root, result, inspector, 0, maxLevel);
  return result.reduce((index, node) => {
    index.set(
      keySupplier ? keySupplier(node) : (node.qualifiedPath as Key),
      node,
    );
    return index;
  }, new Map<Key, PathTreeNode<Terminal, Intermediary>>());
}

/**
 * Prepare a path tree from a list of flat terminal entries.
 * @param entries is a collection of entries in which one of the fields supplies the path
 * @param unitsSupplier function which prepares the list of 'units' that comprise a path for a given entry
 * @returns the tree version fo the flat entries array
 */
export function pathTree<Terminal, Intermediary>(
  entries: Terminal[] | (() => Generator<Terminal>),
  unitsSupplier: (ts: PathTreeTerminalSupplier<Terminal>) => string[],
  intermediarySupplier: (
    ptn: Omit<PathTreeNode<Terminal, Intermediary>, "intermediary">,
    units: string[],
  ) => PathTreeNode<Terminal, Intermediary>,
  options?: {
    readonly tree?: PathTree<Terminal, Intermediary>;
  },
) {
  const tree: PathTree<Terminal, Intermediary> = options?.tree ?? {
    children: [],
  };
  if (Array.isArray(entries)) {
    for (const entry of entries) {
      populatePathTree(
        { terminal: entry },
        tree,
        unitsSupplier,
        intermediarySupplier,
      );
    }
  } else {
    for (const entry of entries()) {
      populatePathTree(
        { terminal: entry },
        tree,
        unitsSupplier,
        intermediarySupplier,
      );
    }
  }
  return tree;
}

/**
 * Transform an array of relational rows with ID and parent ID into a tree
 * @param rows flat array of rows with 'id' and 'parentId' complements
 * @returns a new tree-based array with "children" transformed
 */
export const treeOf = (
  rows: { id: string; parentId?: string | undefined }[],
  id?: string,
): {
  id: string;
  parentId?: string | undefined;
  children?: { id: string; parentId?: string | undefined }[];
}[] =>
  rows
    .filter((item) => item["parentId"] === id)
    .map((item) => ({ ...item, children: treeOf(rows, item.id) }));
