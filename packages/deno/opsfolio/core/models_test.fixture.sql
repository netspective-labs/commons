CREATE TABLE IF NOT EXISTS "graph" (
    "graph_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "graph_nature_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("graph_nature_code") REFERENCES "graph_nature"("code")
);
CREATE TABLE IF NOT EXISTS "boundary" (
    "boundary_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "parent_boundary_id" INTEGER NOT NULL,
    "boundary_nature_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("parent_boundary_id") REFERENCES "boundary"("parent_boundary_id"),
    FOREIGN KEY("boundary_nature_id") REFERENCES "boundary_nature"("code")
);
CREATE TABLE IF NOT EXISTS "host_boundary" (
    "host_boundary_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "host_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("host_id") REFERENCES "host"("host_id")
);
CREATE TABLE IF NOT EXISTS "raci_matrix_subject_boundary" (
    "raci_matrix_subject_boundary_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "boundary_id" INTEGER NOT NULL,
    "raci_matrix_subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("boundary_id") REFERENCES "boundary"("boundary_id"),
    FOREIGN KEY("raci_matrix_subject_id") REFERENCES "raci_matrix_subject"("code")
);
CREATE TABLE IF NOT EXISTS "party" (
    "party_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_type_id" TEXT NOT NULL,
    "party_name" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("party_type_id") REFERENCES "party_type"("code")
);
CREATE TABLE IF NOT EXISTS "raci_matrix_activity" (
    "raci_matrix_activity_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "activity" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN'
);
CREATE TABLE IF NOT EXISTS "party_identifier" (
    "party_identifier_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "identifier_number" TEXT NOT NULL,
    "party_identifier_type_id" TEXT NOT NULL,
    "party_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("party_identifier_type_id") REFERENCES "party_identifier_type"("code"),
    FOREIGN KEY("party_id") REFERENCES "party"("party_id")
);
CREATE TABLE IF NOT EXISTS "person" (
    "person_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_id" INTEGER NOT NULL,
    "person_type_id" TEXT NOT NULL,
    "person_first_name" TEXT NOT NULL,
    "person_last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("party_id") REFERENCES "party"("party_id"),
    FOREIGN KEY("person_type_id") REFERENCES "person_type"("code")
);
CREATE TABLE IF NOT EXISTS "party_relation" (
    "party_relation_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_id" INTEGER NOT NULL,
    "related_party_id" INTEGER NOT NULL,
    "relation_type_id" TEXT NOT NULL,
    "party_role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("party_id") REFERENCES "party"("party_id"),
    FOREIGN KEY("related_party_id") REFERENCES "party"("party_id"),
    FOREIGN KEY("relation_type_id") REFERENCES "party_relation_type"("code"),
    FOREIGN KEY("party_role_id") REFERENCES "party_role_type"("code")
);
CREATE TABLE IF NOT EXISTS "organization" (
    "organization_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "registration_date" DATE NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("party_id") REFERENCES "party"("party_id")
);
CREATE TABLE IF NOT EXISTS "organization_role" (
    "organization_role_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "person_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "organization_role_type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("person_id") REFERENCES "person"("person_id"),
    FOREIGN KEY("organization_id") REFERENCES "organization"("organization_id"),
    FOREIGN KEY("organization_role_type_id") REFERENCES "organization_role_type"("code")
);
CREATE TABLE IF NOT EXISTS "contact_electronic" (
    "contact_electronic_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "contact_type_id" TEXT NOT NULL,
    "party_id" INTEGER NOT NULL,
    "electronics_details" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT 'UNKNOWN',
    FOREIGN KEY("contact_type_id") REFERENCES "contact_type"("code"),
    FOREIGN KEY("party_id") REFERENCES "party"("party_id")
);

INSERT INTO "graph" ("graph_nature_code", "name", "description", "created_by") VALUES ('SERVICE', 'text-value', 'description', NULL);
INSERT INTO "boundary" ("parent_boundary_id", "boundary_nature_id", "name", "description", "created_by") VALUES (0, 'REGULATORY_TAX_ID', 'Boundery Name', 'test description', NULL);
INSERT INTO "boundary" ("parent_boundary_id", "boundary_nature_id", "name", "description", "created_by") VALUES ((SELECT "boundary_id" FROM "boundary" WHERE "parent_boundary_id" = 0 AND "boundary_nature_id" = 'REGULATORY_TAX_ID' AND "name" = 'Boundery Name' AND "description" = 'test description'), 'REGULATORY_TAX_ID', 'Boundery Name Self Test', 'test description', NULL);
INSERT INTO "host" ("host_name", "description", "created_by") VALUES ('Test Host Name', 'description test', NULL);
INSERT INTO "host_boundary" ("host_id", "created_by") VALUES ((SELECT "host_id" FROM "host" WHERE "host_name" = 'Test Host Name' AND "description" = 'description test'), NULL);
INSERT INTO "raci_matrix" ("asset", "responsible", "accountable", "consulted", "informed", "created_by") VALUES ('asset test', 'responsible', 'accountable', 'consulted', 'informed', NULL);
INSERT INTO "raci_matrix_subject_boundary" ("boundary_id", "raci_matrix_subject_id", "created_by") VALUES ((SELECT "boundary_id" FROM "boundary" WHERE "parent_boundary_id" = 0 AND "boundary_nature_id" = 'REGULATORY_TAX_ID' AND "name" = 'Boundery Name' AND "description" = 'test description'), 'CURATION_WORKS', NULL);
INSERT INTO "raci_matrix_activity" ("activity", "created_by") VALUES ('Activity', NULL);
INSERT INTO "party" ("party_type_id", "party_name", "created_by") VALUES ('PERSON', 'person', NULL);
INSERT INTO "party_identifier" ("identifier_number", "party_identifier_type_id", "party_id", "created_by") VALUES ('test identifier', 'PASSPORT', (SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person'), NULL);
INSERT INTO "person" ("party_id", "person_type_id", "person_first_name", "person_last_name", "created_by") VALUES ((SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person'), 'PROFESSIONAL', 'Test First Name', 'Test Last Name', NULL);
INSERT INTO "party_relation" ("party_id", "related_party_id", "relation_type_id", "party_role_id", "created_by") VALUES ((SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person'), (SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person'), 'ORGANIZATION_TO_PERSON', 'VENDOR', NULL);
INSERT INTO "organization" ("party_id", "name", "license", "registration_date", "created_by") VALUES ((SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person'), 'Test Name', 'Test License', 'Mon Feb 06 2023 00:00:00 GMT+0530 (India Standard Time)', NULL);
INSERT INTO "organization_role" ("person_id", "organization_id", "organization_role_type_id", "created_by") VALUES ((SELECT "person_id" FROM "person" WHERE "party_id" = (SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person') AND "person_type_id" = 'PROFESSIONAL' AND "person_first_name" = 'Test First Name' AND "person_last_name" = 'Test Last Name'), (SELECT "organization_id" FROM "organization" WHERE "party_id" = (SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person') AND "name" = 'Test Name' AND "license" = 'Test License' AND "registration_date" = 'Mon Feb 06 2023 00:00:00 GMT+0530 (India Standard Time)'), 'ASSOCIATE_MANAGER_TECHNOLOGY', NULL);
INSERT INTO "contact_electronic" ("contact_type_id", "party_id", "electronics_details", "created_by") VALUES ('MOBILE_PHONE_NUMBER', (SELECT "party_id" FROM "party" WHERE "party_type_id" = 'PERSON' AND "party_name" = 'person'), 'electronics details', NULL);
