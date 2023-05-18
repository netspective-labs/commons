import * as cli from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import * as ws from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.9/lib/universal/whitespace.ts";
import * as SQLa from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.9/render/mod.ts";
import * as dvp from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.9/pattern/data-vault.ts";
import * as mod from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.9/pattern/typical.ts";

const ctx = SQLa.typicalSqlEmitContext();
type EmitContext = typeof ctx;

const dvts = dvp.dataVaultTemplateState<EmitContext>();
const { text, integer, date } = dvts.domains;
const { ulidPrimaryKey: primaryKey } = dvts.keys;

// deno-lint-ignore no-empty-interface
interface SyntheticTmplContext extends SQLa.SqlEmitContext {
}

// deno-lint-ignore no-empty-interface
interface Context extends SQLa.SqlEmitContext {
}

const gts = mod.governedTemplateState<
  mod.GovernedDomain,
  SyntheticTmplContext
>();

const gm = mod.governedModel<mod.GovernedDomain, Context>(gts.ddlOptions);

enum ExecutionContext {
  DEVELOPMENT, // code is text, value is a number
  TEST,
  PRODUCTION,
}

enum OrganizationRoleType {
  PROJECT_MANAGER_TECHNOLOGY = "Project Manager Technology",
  PROJECT_MANAGER_QUALITY = "Project Manager Quality",
  PROJECT_MANAGER_DEVOPS = "Project Manager DevOps",
  ASSOCIATE_MANAGER_TECHNOLOGY = "Associated Manager Technology",
  ASSOCIATE_MANAGER_QUALITY = "Associate Manager Quality",
  ASSOCIATE_MANAGER_DEVOPS = "Associate Manager DevOps",
  SENIOR_LEAD_SOFTWARE_ENGINEER_ARCHITECT =
    "Senior Lead Software Engineer Architect",
  LEAD_SOFTWARE_ENGINEER_ARCHITECT = "Lead Software Engineer Architect",
  SENIOR_LEAD_SOFTWARE_QUALITY_ENGINEER =
    "Senior Lead Software Quality Engineer",
  SENIOR_LEAD_SOFTWARE_DEVOPS_ENGINEER = "Senior Lead Software DevOps Engineer",
  LEAD_SOFTWARE_ENGINEER = "Lead Software Engineer",
  LEAD_SOFTWARE_QUALITY_ENGINEER = "Lead Software Quality Engineer",
  LEAD_SOFTWARE_DEVOPS_ENGINEER = "Lead Software DevOps Engineer",
  LEAD_SYSTEM_NETWORK_ENGINEER = "Lead System Network Engineer",
  SENIOR_SOFTWARE_ENGINEER = "Senior Software Engineer",
  SENIOR_SOFTWARE_QUALITY_ENGINEER = "Senior Software Quality Engineer",
  SOFTWARE_QUALITY_ENGINEER = "Software Quality Engineer",
  SECURITY_ENGINEER = "Security Engineer",
}

enum PartyType {
  PERSON = "Person",
  ORGANIZATION = "Organization",
}

enum PartyRole {
  CUSTOMER = "Customer",
  VENDOR = "Vendor",
}

const execCtx = gm.ordinalEnumTable("execution_context", ExecutionContext);

const organizationRoleType = gm.textEnumTable(
  "organization_role_type",
  OrganizationRoleType,
  { isIdempotent: true },
);

const partyType = gm.textEnumTable(
  "party_type",
  PartyType,
  { isIdempotent: true },
);

const partyRole = gm.textEnumTable(
  "party_role_type",
  PartyRole,
  { isIdempotent: true },
);

const partyTable = SQLa.tableDefinition("party", {
  party_id: primaryKey(),
  party_type_id: partyType.references.code(),
  party_name: text(),
  ...dvts.housekeeping.columns,
});

const notesTable = SQLa.tableDefinition("note", {
  note_id: primaryKey(),
  party_id: partyTable.references.party_id(),
  note: text(),
  ...dvts.housekeeping.columns,
});

function sqlDDL(options: {
  destroyFirst?: boolean;
  schemaName?: string;
} = {}) {
  const { destroyFirst, schemaName } = options;

  // NOTE: every time the template is "executed" it will fill out tables, views
  //       in dvts.tablesDeclared, etc.
  // deno-fmt-ignore
  return SQLa.SQL<EmitContext>(dvts.ddlOptions)`
    ${ destroyFirst && schemaName
       ? `drop schema if exists ${schemaName} cascade;`
       : "-- not destroying first (for development)" }
    ${ schemaName
       ? `create schema if not exists ${schemaName};`
       : "-- no schemaName provided" }

      ${execCtx}
      ${organizationRoleType}
      ${partyType}
      ${partyRole}
      ${partyTable}
      ${notesTable}
    `;
}

function handleSqlCmd(options: {
  dest?: string | undefined;
  destroyFirst?: boolean;
  schemaName?: string;
} = {}) {
  const output = ws.unindentWhitespace(sqlDDL(options).SQL(ctx));
  if (options.dest) {
    Deno.writeTextFileSync(options.dest, output);
  } else {
    console.log(output);
  }
}

// deno-fmt-ignore (so that command indents don't get reformatted)
await new cli.Command()
  .name("er-dv-sqla")
  .version("0.0.2")
  .description("Entity Resolution Data Vault SQL Aide")
  .action(() => handleSqlCmd())
  .command("help", new cli.HelpCommand().global())
  .command("completions", new cli.CompletionsCommand())
  .command("sql", "Emit SQL")
    .option("-d, --dest <file:string>", "Output destination, STDOUT if not supplied")
    .option("--destroy-first", "Include SQL to destroy existing objects first (dangerous but useful for development)")
    .option("--schema-name <schemaName:string>", "If destroying or creating a schema, this is the name of the schema")
    .action((options) => handleSqlCmd(options))
  .command("diagram", "Emit Diagram")
    .option("-d, --dest <file:string>", "Output destination, STDOUT if not supplied")
    .action((options) => {
      // "executing" the following will fill dvts.tablesDeclared but we don't
      // care about the SQL output, just the state management (tablesDeclared)
      sqlDDL().SQL(ctx);
      const pumlERD = dvts.pumlERD(ctx).content;
      if(options.dest) {
        Deno.writeTextFileSync(options.dest, pumlERD)
      } else {
        console.log(pumlERD)
      }
    })
    .parse(Deno.args);
