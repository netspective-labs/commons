import * as SQLa from "../../../../../netspective-labs/sql-aide/render/mod.ts";
import * as SQL from "../../../../../netspective-labs/sql-aide/render/emit/sql.ts";
import * as mod from "../../../../../netspective-labs/sql-aide/pattern/data-vault.ts";
import { number } from "https://deno.land/x/zod@v3.21.4/types.ts";
import { tableDefinition } from "../../../../sql-aide/render/ddl/table/table.ts";

type SyntheticContext = SQLa.SqlEmitContext;

// TODO: Create per algorithm entity_match link satellite tables.

const expectType = <T>(_value: T) => {
  // Do nothing, the TypeScript compiler handles this for us
};

const ctx1: SyntheticContext = { ...SQLa.typicalSqlEmitContext() };
const syntheticSchema = () => {
  const ctx: SyntheticContext = { ...SQLa.typicalSqlEmitContext() };
  const stso = SQLa.typicalSqlTextSupplierOptions<SyntheticContext>();
  const dvg = mod.dataVaultGovn<SyntheticContext>(stso);
  const { text, textNullable, integer, integerNullable, date } = dvg.domains;
  const { ulidPrimaryKey: primaryKey } = dvg.keys;

  const erEntityHub = dvg.hubTable("er_entity", {
    hub_er_entity_id: primaryKey(),
    ssn_business_key: text(),
    ...dvg.housekeeping.columns,
  });

  const erAlgorithmLookupTable = tableDefinition("er_algorithm", {
    algorithm_id: primaryKey(),
    algorithm_name: text(),
    algorithm_version: text(),
    algorithm_sp: text(),
  });

  const erJobHub = dvg.hubTable("er_job", {
    hub_er_job_id: primaryKey(),
    job_business_job_name: text(),
    ...dvg.housekeeping.columns,
  });

  const erEntityHubSat = erEntityHub.satelliteTable("er_entity_attribute", {
    hub_er_entity_id: erEntityHub.references.hub_er_entity_id(),
    name: text(),
    address: text(),
    phone: text(),
    ...dvg.housekeeping.columns,
    sat_er_entity_er_entity_attribute_id: primaryKey(),
  });

  const erJobHubSat = erJobHub.satelliteTable("er_job_state", {
    algorithm_id: integer(),
    run_date_time: date(),
    status: text(),
    ...dvg.housekeeping.columns,
    hub_er_job_id: erJobHub.references.hub_er_job_id(),
    sat_er_job_er_job_state_id: primaryKey(),
  });

  const erEntityMatchLink = dvg.linkTable("er_entity_match", {
    link_er_entity_match_id: primaryKey(),
    hub_entity_id: erEntityHubSat.references
      .sat_er_entity_er_entity_attribute_id(),
    algorithm_ref: erAlgorithmLookupTable.references.algorithm_id(),
    ...dvg.housekeeping.columns,
  });

  const erEntityMatchLevenshteinLinkSat = erEntityMatchLink.satelliteTable(
    "er_entity_match_levenshtien",
    {
      distance_value: number(),
      similarity_score: number(),
      normalized_distance: number(),
      notes: text(),
      ...dvg.housekeeping.columns,
      sat_er_entity_match_er_entity_match_levenshtien_id: primaryKey(),
      link_er_entity_match_id: erEntityMatchLink.references
        .link_er_entity_match_id(),
    },
  );

  const erEntityMatchSoundexLinkSat = erEntityMatchLink.satelliteTable(
    "er_entity_match_soundex",
    {
      code: text(),
      similarity_score: number(),
      index: number(),
      ...dvg.housekeeping.columns,
      sat_er_entity_match_er_entity_match_soundex_id: primaryKey(),
      link_er_entity_match_id: erEntityMatchLink.references
        .link_er_entity_match_id(),
    },
  );

  return {
    ctx,
    stso,
    ...dvg,
    erAlgorithmLookupTable,
    erEntityHub,
    erJobHub,
    erJobHubSat,
    erEntityMatchLink,
    erEntityMatchLevenshteinLinkSat,
    erEntityMatchSoundexLinkSat,
  };
};

const schema = syntheticSchema();

const { erAlgorithmLookupTable: tableAlgorithmList } = schema;
const { erEntityHub: tableEntityHub } = schema;
const { erJobHub: tableJobHub } = schema;
const { erJobHubSat: tableJobSat } = schema;
const { erEntityMatchLink: tableEntityMatchLink } = schema;
const { erEntityMatchLevenshteinLinkSat: tableEntityMatchLevenshteinSatLink } =
  schema;
const { erEntityMatchSoundexLinkSat: tableEntityMatchSoundexSatLink } = schema;

const templateDefn1 = SQLa.SQL<SyntheticContext>(schema.stso)`

  -- Data Vault tables

    ${tableAlgorithmList}
    ${tableEntityHub}
    ${tableJobHub}
    ${tableJobSat}
    ${tableEntityMatchLink}
    ${tableEntityMatchLevenshteinSatLink}
    ${tableEntityMatchSoundexSatLink}
    `;

console.log(templateDefn1.SQL(ctx1));

// write generated SQL to a file

SQL.typicalSqlTextPersistOptions();

export const schema1 = schema;
