import { describe, expect, it } from "vitest";
import * as mod from "./interpolate.js";

describe("textInterpolator", () => {
  it("typed env vars with single, observable, custom function using { } wrapped tokens", async () => {
    const { interpolateObservable: interpO } = mod.textInterpolator<{
      ENV_TEST1: string;
      ENV_TEST2: string;
    }>({
      replace: (token) => {
        switch (token) {
          case "ENV_TEST1":
            return process.env.ENV_TEST1 ?? "error";
          case "ENV_TEST2":
            return process.env.ENV_TEST2 ?? "none";
          default:
            return false;
        }
      },
      regExp: /{([^${}]*)}/g,
      unwrap: (wrapped: string) => wrapped.slice(1, wrapped.length - 1), // extract 'xyz' from '{xyz}'
    });
    const envTest1 = process.env.ENV_TEST1 ?? "error";
    const synthetic1 =
      "this should replace {ENV_TEST1} and {ENV_TEST2}, leaving {UNKNOWN}";

    // interpolateObservable is useful when we want the interpolation result
    // to include not only the transformed text but also the interpolated
    // values
    expect(interpO(synthetic1)).toEqual({
      interpolated: { ENV_TEST1: envTest1, ENV_TEST2: "none" },
      transformedText: `this should replace ${envTest1} and none, leaving {UNKNOWN}`,
    });
  });

  it("typed env var with multiple functions using ${ } wrapped tokens", async () => {
    const { interpolate } = mod.textInterpolator<{
      ENV_TEST1: string;
      ENV_TEST2: string;
    }>({
      replace: {
        ENV_TEST1: () => process.env.ENV_TEST1 ?? "missing",
        ENV_TEST2: () => process.env.ENV_TEST2 ?? "none",
      },
    });
    const envTest1 = process.env.ENV_TEST1 ?? "missing";
    const synthetic1 =
      "this should replace ${ENV_TEST1} and ${ENV_TEST2}, leaving ${UNKNOWN}";
    expect(interpolate(synthetic1)).toBe(
      `this should replace ${envTest1} and none, leaving \${UNKNOWN}`,
    );
  });
});
