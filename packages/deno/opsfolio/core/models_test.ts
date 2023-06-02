import $ from "https://deno.land/x/dax@0.30.1/mod.ts";
import * as ta from "https://deno.land/std@0.178.0/testing/asserts.ts";

const relativeFilePath = (name: string) => {
  const absPath = $.path.fromFileUrl(import.meta.resolve(name));
  return $.path.relative(Deno.cwd(), absPath);
};

const relativeFileContent = (name: string) => {
  const absPath = $.path.fromFileUrl(import.meta.resolve(name));
  return Deno.readTextFileSync($.path.relative(Deno.cwd(), absPath));
};

Deno.test("Model test case for Opsfolio Core", async (tc) => {
  const CLI = relativeFilePath("./models-driver.ts");

  await tc.step("01. CLI's SQL", async () => {
    const output = await $`./${CLI} sql`.text();
    ta.assertEquals(
      output,
      relativeFileContent("./models_test.fixture.sql"),
    );
  });
});
