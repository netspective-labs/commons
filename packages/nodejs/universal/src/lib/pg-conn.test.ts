import { describe, expect, it } from "vitest";
import * as mod from "./pg-conn";

describe("PostgreSQL Connection Manager", async () => {
  it("is not configured", () => {
    const factory = mod.dbConfigureFromText(() => undefined);
    expect(factory.isConfigured).toBeFalsy();
  });

  it("is has configuration parse error", () => {
    const factory = mod.dbConfigureFromText(() => '{ badJson: "passed-in" ');
    expect(factory.isConfigured).toBeFalsy();
    expect(factory.configTextParseError).toBeDefined();
  });

  it("is configured programmatically (but not necessarily connectable)", () => {
    const dbc1 = mod.dbConfigureFromText(
      () => `postgres://PGUSER:PGPASSWORD@PGPORT:PGPORT/PGDATABASE`,
    );
    expect(dbc1.isConfigured).toBeTruthy();
    expect(dbc1.connURLs).toBeDefined();
    expect(dbc1.connURLs?.URLs).toBeDefined();
    expect(dbc1.connURLs?.defaultConnID).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    expect(Object.keys(dbc1.connURLs?.URLs!).length).toBe(1);
    //
    expect(dbc1.defaultConnURL).toBeTruthy();

    // TODO: add test case for JSON-based multi-connection setup
    // export SERVICE_DB_CONN_URLS="{ \"defaultConnID\": \"FCR_GITLAB_PKC\", \"URLs\": `pgpass urls-dict-json` }"
  });

  it("is configured declaratively from env using SERVICE_DB_CONN_URLS and connectable", async () => {
    const factory = mod.dbConnsFactory()();
    if (factory.dbConfig.isConfigured && factory.dbConfig?.connURLs?.URLs) {
      const conn = await factory.conn("badID");
      expect(conn.state).toBe("invalid connection ID");

      for (const connID of Object.keys(factory.dbConfig.connURLs.URLs)) {
        const conn = await factory.conn(connID);
        expect(
          conn.state,
          `PostgreSQL conn ID '${connID}' should be valid`,
        ).toBe("valid");
      }

      await factory.end();
    } else {
      console.info(
        "PostgreSQL connections are not configured (SERVICE_DB_CONN_URLS not defined?)",
      );
      expect(factory.dbConfig.isConfigured).toBeFalsy();
    }
  });
});
