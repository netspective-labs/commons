import * as t from "./tree.js";

export type TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit> = (
  node: t.PathTreeNode<Terminal, Intermediary>,
) => PathwayUnit;

export interface TreePathwaysSupplier<Terminal, Intermediary, PathwayUnit> {
  intermediaryUnit: TreePathwayUnitSupplier<
    Terminal,
    Intermediary,
    PathwayUnit
  >;
  terminalUnit: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>;
  byNodeKey: (
    indexKey: string,
    options?: {
      refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
      includeTerminal?: TreePathwayUnitSupplier<
        Terminal,
        Intermediary,
        PathwayUnit
      >;
    },
  ) => PathwayUnit[] | undefined;
  byNode: (
    node: t.PathTreeNode<Terminal, Intermediary>,
    options?: {
      refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
      includeTerminal?: TreePathwayUnitSupplier<
        Terminal,
        Intermediary,
        PathwayUnit
      >;
    },
  ) => PathwayUnit[];
}

/**
 * Prepare an function which, when called, will compute a node's "pathway" (breadcrumbs)
 * @param tree is the tree for which pathway should be computed
 * @param intermediaryUnit a function which computes what a non-terminal breadcrumb contains
 * @param terminalUnit a function which computes what a terminal breadcrumb contains
 * @param defaultOptions the options that will be passed into the byNodeKey and byNode functions
 * @returns an object which provides breadcrumbs preparation by node key or node
 */
export function treePathwaysPreparer<Terminal, Intermediary, PathwayUnit>(
  tree: t.PathTree<Terminal, Intermediary>,
  intermediaryUnit: TreePathwayUnitSupplier<
    Terminal,
    Intermediary,
    PathwayUnit
  >,
  terminalUnit: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>,
  defaultOptions?: {
    index?: Map<string, t.PathTreeNode<Terminal, Intermediary>>;
    refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
    includeTerminal?: TreePathwayUnitSupplier<
      Terminal,
      Intermediary,
      PathwayUnit
    >;
  },
): TreePathwaysSupplier<Terminal, Intermediary, PathwayUnit> {
  const index = defaultOptions?.index ?? t.pathTreeIndex(tree);
  const cachedNodeKeys = new Map<string, PathwayUnit[]>();
  const cachedNodeQPs = new Map<string, PathwayUnit[]>();
  return {
    intermediaryUnit,
    terminalUnit,
    byNodeKey: (
      indexKey: string,
      options?: {
        refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
        includeTerminal?: TreePathwayUnitSupplier<
          Terminal,
          Intermediary,
          PathwayUnit
        >;
      },
    ): PathwayUnit[] | undefined => {
      let result = cachedNodeKeys.get(indexKey);
      if (!result) {
        const refine = options?.refine ?? defaultOptions?.refine;
        const includeTerminal =
          options?.includeTerminal ?? defaultOptions?.includeTerminal;
        const node = index.get(indexKey);
        if (!node) return undefined;
        // we use slice().reverse() because reverse() mutates original
        result = node.ancestors.slice().reverse().map(intermediaryUnit);
        if (includeTerminal) result.push(terminalUnit(node));
        result = refine ? refine(result) : result;
        cachedNodeKeys.set(indexKey, result);
      }
      return result;
    },
    byNode: (
      node: t.PathTreeNode<Terminal, Intermediary>,
      options?: {
        refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
        includeTerminal?: TreePathwayUnitSupplier<
          Terminal,
          Intermediary,
          PathwayUnit
        >;
      },
    ): PathwayUnit[] => {
      let result = cachedNodeQPs.get(node.qualifiedPath);
      if (!result) {
        const refine = options?.refine ?? defaultOptions?.refine;
        const includeTerminal =
          options?.includeTerminal ?? defaultOptions?.includeTerminal;
        // we use slice().reverse() because reverse() mutates original
        result = node.ancestors.slice().reverse().map(intermediaryUnit);
        if (includeTerminal) result.push(terminalUnit(node));
        result = refine ? refine(result) : result;
        cachedNodeQPs.set(node.qualifiedPath, result);
      }
      return result;
    },
  };
}
