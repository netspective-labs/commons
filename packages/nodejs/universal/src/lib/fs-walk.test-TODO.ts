import { describe, expect, it } from "vitest";
import * as mod from "./fs-walk.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export type FrontmatterValue =
  | string
  | number
  | boolean
  | { [x: string]: FrontmatterValue }
  | FrontmatterValue[];
export type TransformableFrontmatter = Record<string, FrontmatterValue>;

// vfile https://www.npmjs.com/package/vfile instance but instead of using the
// type directly we create a structured typed so that we don't have to  worry
// about imports
export interface RemarkVfile {
  readonly value?: string | Buffer;
  readonly cwd?: string;
  readonly path: URL | string;
  readonly basename: string | undefined;
  readonly extname: string | undefined;
  readonly dirname: string | undefined;
  readonly data: Any;
}
export type RouteFrontmatterTransformer = (
  tf: () => TransformableFrontmatter,
  vfile: RemarkVfile,
) => Promise<void>;

// tree is Remark Mardkown content AST
export type RouteRemarkPlugin = (
  tree: Any,
  vfile: RemarkVfile,
) => Promise<void>;

export interface RouteFrontmatter {
  readonly transformFM?: RouteFrontmatterTransformer;
}

export interface RouteContent {
  readonly remarkPlugin?: RouteRemarkPlugin;
}

export interface IntermediateRouteUnit {
  readonly label: string;
  readonly abbreviation?: string;
  readonly frontmatter?: RouteFrontmatter;
  readonly content?: RouteContent;
}

// this is the signature of each _route.ts file
export type IntermediateRouteUnitSupplier = () => IntermediateRouteUnit;

export interface DiscoveredRouteUnit extends IntermediateRouteUnit {
  readonly slug: string;
  readonly originFsPath: string;
}

describe("walkFsEntries", () => {
  it("should find and import _route.ts files and import intermediateRouteUnit() result", async () => {
    const irUnits = new Map<
      string,
      {
        readonly we: mod.WalkEntry;
        readonly iru: IntermediateRouteUnit;
      }
    >();

    // FIXME:
    await mod.walkFsEntries(`${__dirname}/../../content/prose-flexible`, {
      onFile: async (we) => {
        if (we.absPath.endsWith("_route.ts")) {
          const { intermediateRouteUnit } = (await import(we.absPath)) as {
            intermediateRouteUnit: () => IntermediateRouteUnit;
          };
          if (typeof intermediateRouteUnit === "function") {
            const iru = intermediateRouteUnit();
            if (iru)
              irUnits.set(we.relPath, {
                we,
                iru,
              });
          }
        }
        return "continue";
      },
    });

    expect(irUnits.size).toBeGreaterThanOrEqual(3);
    [
      "gpm/_route.ts",
      "gpm/medigy/_route.ts",
      "gpm/medigy/purpose-mission-vision/_route.ts",
      "gpm/medigy-co/_route.ts",
      "gpm/medigy-co/project-management/_route.ts",
      "gpm/medigy-co/requirements/_route.ts",
    ].forEach((v) => expect(Array.from(irUnits.keys())).toContain(v));

    const gpmIRU = irUnits.get("gpm/_route.ts");
    expect(gpmIRU?.we.relPath).toBe("gpm/_route.ts");
    expect(gpmIRU?.iru.label).toBe("Governance, Planning and Management");
    expect(gpmIRU?.iru.abbreviation).toBe("GPM");
  });
});
