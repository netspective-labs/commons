import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import * as SQLa from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.5/render/mod.ts";
import * as dvp from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.5/pattern/data-vault.ts";
import * as dia from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.5/render/diagram/plantuml-ie-notation.ts";

const ctx = SQLa.typicalSqlEmitContext();
type EmitContext = typeof ctx;

const stso = SQLa.typicalSqlTextSupplierOptions<EmitContext>();
const dvg = dvp.dataVaultGovn<EmitContext>(stso);
const { text, textNullable, integer, integerNullable, date } = dvg.domains;
const { ulidPrimaryKey: primaryKey } = dvg.keys;

const erEntityHub = dvg.hubTable("er_entity", {
  hub_er_entity_id: primaryKey(),
  ssn_business_key: text(),
  ...dvg.housekeeping.columns,
});

const erAlgorithmLookupTable = SQLa.tableDefinition("er_algorithm", {
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
  sat_er_entity_er_entity_attribute_id: primaryKey(),
  hub_er_entity_id: erEntityHub.references.hub_er_entity_id(),
  name: text(),
  address: text(),
  phone: text(),
  ...dvg.housekeeping.columns
});

const erJobHubSat = erJobHub.satelliteTable("er_job_state", {
  sat_er_job_er_job_state_id: primaryKey(),
  hub_er_job_id: erJobHub.references.hub_er_job_id(),
  algorithm_id: integer(),
  run_date_time: date(),
  status: text(),
  ...dvg.housekeeping.columns,
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
    sat_er_entity_match_er_entity_match_levenshtien_id: primaryKey(),
    link_er_entity_match_id: erEntityMatchLink.references
      .link_er_entity_match_id(),
    distance_value: integer(),
    similarity_score: integer(),
    normalized_distance: integer(),
    notes: text(),
    ...dvg.housekeeping.columns,
  },
);

const erEntityMatchSoundexLinkSat = erEntityMatchLink.satelliteTable(
  "er_entity_match_soundex",
  {
    sat_er_entity_match_er_entity_match_soundex_id: primaryKey(),
    link_er_entity_match_id: erEntityMatchLink.references
      .link_er_entity_match_id(),
    code: text(),
    similarity_score: integer(),
    index: integer(),
    ...dvg.housekeeping.columns,
  },
);

function handleSQL(_options?: {
  dest?: string | undefined;
}) {
/**
 * Template which generates schema objects when none exist; other templates
 * should be defined for schema migrations.
 */
const seedDDL = SQLa.SQL<EmitContext>(stso)`
${erAlgorithmLookupTable}

${erEntityHub}

${erJobHub}

${erJobHubSat}

${erEntityMatchLink}

${erEntityMatchLevenshteinLinkSat}

${erEntityMatchSoundexLinkSat}`;
  console.log(seedDDL.SQL(ctx));
}

function handleDiagram(_options?: {
  dest?: string | undefined;
}) {
  const pumlERD = dia.plantUmlIE(ctx, function* () {
    yield erAlgorithmLookupTable.graphEntityDefn();
    yield erEntityHub.graphEntityDefn();
    yield erJobHub.graphEntityDefn();
    yield erEntityMatchLink.graphEntityDefn();
    yield erEntityMatchLevenshteinLinkSat.graphEntityDefn();
    yield erEntityMatchSoundexLinkSat.graphEntityDefn();
  }, dia.typicalPlantUmlIeOptions());
  console.log(pumlERD.content)
}

// deno-fmt-ignore
await new Command()
  .name("er-dv-sqla")
  .version("0.0.1")
  .description("Entity Resolution Data Vault SQL Aide")
  .action(() => handleSQL())
  .command("sql", "Emit SQL")
    .option("-d, --dest <file:string>", "Output destination, STDOUT if not supplied")
    .action((options) => handleSQL(options))
  .command("diagram", "Emit Diagram")
    .option("-d, --dest <file:string>", "Output destination, STDOUT if not supplied")
    .action((options) => handleDiagram(options))
    .parse(Deno.args);
