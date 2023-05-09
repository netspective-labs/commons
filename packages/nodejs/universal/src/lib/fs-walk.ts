import * as fs from "node:fs";
import * as path from "node:path";

export interface WalkEntry {
  readonly parentRelPath?: string | undefined;
  readonly absPath: string;
  readonly relPath: string;
  readonly level: number;
  readonly stat: fs.Stats;
}

export async function walkFsEntries(
  startDir: string,
  options?: {
    readonly onFile?: (we: WalkEntry) => Promise<"continue" | "stop" | void>;
    readonly onDirectory?: (we: WalkEntry) => Promise<"enter" | "stop">;
  },
  parentRelPath?: string,
  level = 0,
) {
  const { onFile, onDirectory } = options ?? {};
  const sdStat = fs.statSync(startDir);
  if (!sdStat.isDirectory) throw Error("startDir is not a directory");

  const entries = fs.readdirSync(startDir);

  WALK: for (const entry of entries) {
    const absPath = path.join(startDir, entry);
    const relPath = path.join(parentRelPath ?? "", entry);
    const stat = fs.statSync(absPath);
    if (stat.isDirectory()) {
      const instruction = onDirectory
        ? await (onDirectory?.({
            parentRelPath,
            absPath,
            relPath,
            stat,
            level,
          }) ?? "enter")
        : "enter";
      switch (instruction) {
        case "enter":
          await walkFsEntries(absPath, options, relPath, level + 1);
          break;

        case "stop":
          break WALK;
      }
    } else {
      const instruction = onFile
        ? await onFile({
            parentRelPath,
            absPath,
            relPath,
            stat,
            level,
          })
        : "continue";
      if (instruction === "stop") break WALK;
    }
  }
}
