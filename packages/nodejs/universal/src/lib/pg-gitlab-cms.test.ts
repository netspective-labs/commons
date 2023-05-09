import { describe, expect, it } from "vitest";
import * as pgc from "./pg-conn";
import * as mod from "./pg-gitlab-cms";

// TODO: check each conn to make sure it actually connected
// because in a CI/CD environment the conn may fail but the
// proxy (memoized) data will be picked up.

describe("GitLab as a CMS", async () => {
  const pkcNamespaceName = "Precision Knowledge Content";
  it("namespace not found", async () => {
    // gitLabNamespaceQR is memoizable so the first function call get thes the "memoizable promise"
    // and the second call performs the database call;
    const conn = await pgc.dbConnsFactory()().conn();
    const ns = await mod.gitLabNamespaceQR(
      conn,
      "pg-gitlab-cms.test-invalid-namespace",
    )();
    expect(ns).toEqual([]);
  });

  it("PKC namespace found", async () => {
    // gitLabNamespaceQR is memoizable so the first function call get thes the "memoizable promise"
    // and the second call performs the database call;
    const conn = await pgc.dbConnsFactory()().conn();
    const pkcNS = await mod.gitLabNamespaceQR(conn, pkcNamespaceName)();
    expect(pkcNS.length).toBe(1);
    expect(pkcNS[0]?.name).toEqual("Precision Knowledge Content");
    expect(pkcNS[0]?.path).toEqual("precision-knowledge-content");
  });

  it("PKC content acquired", async () => {
    const conn = await pgc.dbConnsFactory()().conn();
    const pkcnc = await mod.namespaceContent(conn, pkcNamespaceName);
    expect(pkcnc).toBeDefined();

    const pkcIssues = await pkcnc!.contentCollections();
    expect(pkcIssues.collections.length).toBeGreaterThan(0);

    const pkcUsers = await pkcnc!.users();
    expect(pkcUsers.users.length).toBeGreaterThan(0);

    // TODO: add more tests
  });

  //await dbcFactory.end();
});
