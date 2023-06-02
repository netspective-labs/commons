#!/usr/bin/env -S deno run --allow-all
// the #! (`shebang`) descriptor allows us to run this script as a binary on Linux
import * as tp from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.33/pattern/typical/mod.ts";

const { SQLa, ws } = tp;
type EmitContext = typeof ctx;
export const ctx = SQLa.typicalSqlEmitContext();
import * as mod from "./models.ts";

const gts = tp.governedTemplateState<tp.GovernedDomain, EmitContext>();

const graphTableInsertion = mod.graph.insertDML({
  name: "text-value",
  graph_nature_code: "SERVICE",
  description: "description",
});

const boundaryInsertion = mod.boundary.insertDML({
  boundary_nature_id: "REGULATORY_TAX_ID",
  name: "Boundery Name",
  description: "test description",
  parent_boundary_id: 0,
});

const parentBoundaryID = mod.boundary.select(boundaryInsertion.insertable);

const boundarySelfInsertion = mod.boundary.insertDML({
  boundary_nature_id: "REGULATORY_TAX_ID",
  name: "Boundery Name Self Test",
  description: "test description",
  parent_boundary_id: parentBoundaryID,
});

const hostInsertion = mod.host.insertDML({
  host_name: "Test Host Name",
  description: "description test",
});

const hostID = mod.host.select(hostInsertion.insertable);
const hostBoundaryInsertion = mod.hostBoundary.insertDML({
  host_id: hostID,
});

const raciMatrixInsertion = mod.raciMatrix.insertDML({
  asset: "asset test",
  responsible: "responsible",
  accountable: "accountable",
  consulted: "consulted",
  informed: "informed",
});

const raciMatrixSubjectBoundaryInsertion = mod.raciMatrixSubjectBoundary
  .insertDML({
    boundary_id: parentBoundaryID,
    raci_matrix_subject_id: "CURATION_WORKS",
  });

const raciMatrixActivityInsertion = mod.raciMatrixActivity
  .insertDML({
    activity: "Activity",
  });

const partyInsertion = mod.party
  .insertDML({
    party_type_id: "PERSON",
    party_name: "person",
  });

const partyID = mod.party.select(partyInsertion.insertable);

const partyIdentifierInsertion = mod.partyIdentifier
  .insertDML({
    identifier_number: "test identifier",
    party_identifier_type_id: "PASSPORT",
    party_id: partyID,
  });

const personInsertion = mod.person
  .insertDML({
    party_id: partyID,
    person_type_id: "PROFESSIONAL",
    person_first_name: "Test First Name",
    person_last_name: "Test Last Name",
  });

const partyRelationInsertion = mod.partyRelation
  .insertDML({
    party_id: partyID,
    related_party_id: partyID,
    relation_type_id: "ORGANIZATION_TO_PERSON",
    party_role_id: "VENDOR",
  });

function sqlDDL() {
  return SQLa.SQL<EmitContext>(gts.ddlOptions)`
    ${mod.graph}
    ${graphTableInsertion}
    ${mod.boundary}
    ${boundaryInsertion}
    ${boundarySelfInsertion}
    ${mod.host}
    ${hostInsertion}
    ${mod.hostBoundary}
    ${hostBoundaryInsertion}
    ${mod.raciMatrix}
    ${raciMatrixInsertion}
    ${mod.raciMatrixSubjectBoundary}
    ${raciMatrixSubjectBoundaryInsertion}
    ${mod.raciMatrixActivity}
    ${raciMatrixActivityInsertion}
    ${mod.party}
    ${partyInsertion}
    ${mod.partyIdentifier}
    ${partyIdentifierInsertion}
    ${mod.person}
    ${personInsertion}
    ${mod.partyRelation}
    ${partyRelationInsertion}
    `;
}
if (import.meta.main) {
  tp.typicalCLI({
    resolve: (specifier) =>
      specifier ? import.meta.resolve(specifier) : import.meta.url,
    prepareSQL: () => ws.unindentWhitespace(sqlDDL().SQL(ctx)),
    prepareDiagram: () => {
      // "executing" the following will fill gm.tablesDeclared but we don't
      // care about the SQL output, just the state management (tablesDeclared)
      sqlDDL().SQL(ctx);
      return gts.pumlERD(ctx).content;
    },
  }).commands.parse(Deno.args);
}
