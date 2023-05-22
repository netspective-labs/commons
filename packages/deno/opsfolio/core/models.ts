#!/usr/bin/env -S deno run --allow-all

import * as tp from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.12/pattern/typical/mod.ts";
const { SQLa, ws } = tp;

const ctx = SQLa.typicalSqlEmitContext();
type EmitContext = typeof ctx;

const gts = tp.governedTemplateState<tp.GovernedDomain,EmitContext>();
const gm = tp.governedModel<tp.GovernedDomain, EmitContext>(gts.ddlOptions);
const { text, textNullable, integer, date, dateNullable, dateTime } = gm.domains;
const { ulidPrimaryKey: primaryKey } = gm.keys;

export enum ExecutionContext {
  DEVELOPMENT, // code is text, value is a number
  TEST,
  PRODUCTION,
}

export enum OrganizationRoleType {
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

export enum PartyType {
  PERSON = "Person",
  ORGANIZATION = "Organization",
}

export enum PartyRole {
  CUSTOMER = "Customer",
  VENDOR = "Vendor",
}

export enum PartyRelationType {
  PERSON_TO_PERSON = "Person To Person",
  ORGANIZATION_TO_PERSON = "Organization To Person",
  ORGANIZATION_TO_ORGANIZATION = "Organization To Organization",
}

export enum PartyIdentifierType {
  UUID = "UUID",
  DRIVING_LICENSE = "Driving License",
  PASSPORT = "Passport",
}

export enum PersonType {
  INDIVIDUAL = "Individual",
  PROFESSIONAL = "Professional",
}

export enum ContactType {
  HOME_ADDRESS = "Home Address",
  OFFICIAL_ADDRESS = "Official Address",
  MOBILE_PHONE_NUMBER = "Mobile Phone Number",
  LAND_PHONE_NUMBER = "Land Phone Number",
  OFFICIAL_EMAIL = "Official Email",
  PERSONAL_EMAIL = "Personal Email",
}

export enum TrainingSubject {
  HIPAA = "HIPAA",
  CYBER_SECURITY = "Cyber Security",
  OBSERVABILITY_OPEN_TELEMETRY = "Observability Open Telemetry",
  BEST_PRACTICES_OF_AGILE = "Practices of Agile Workflow",
}

export enum StatusValues {
  YES = "Yes",
  NO = "No",
}

/**
 * Reference URL: https://schema.org/ratingValue
 */

export enum RatingValue {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
}

export enum ContractType {
  GENERAL_CONTRACT_FOR_SERVICES = "General Contract for Services",
  EMPLOYMENT_AGREEMENT = "Employment Agreement",
  NONCOMPETE_AGREEMENT = "Noncompete Agreement",
  VENDOR_SLA = "Vendor SLA",
  VENDOR_NDA = "Vendor NDA",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_project_risk_type_enum.html
 */

export enum RiskType {
  BUDGET = "Budget",
  QUALITY = "Quality",
  SCHEDULE = "Schedule",
  SCHEDULE_AND_BUDGET = "Schedule And Budget",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_payment_type_enum.html
 */

export enum PaymentType {
  BOTH = "Both",
  LOANS = "Loans",
  NONE = "None",
  RENTS = "Rents",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

export enum Periodicity {
  ANNUAL = "Annual",
  BI_MONTHLY = "Bi Monthly",
  BI_WEEKLY = "Bi Weekly",
  DAILY = "Daily",
  MONTHLY = "Monthly",
  OTHER = "Other",
  QUARTERLY = "Quarterly",
  SEMI_ANNUAL = "Semi Annual",
  SEMI_MONTHLY = "Semi Monthly",
  WEEKLY = "Weekly",
}

export enum BoundaryNature {
  REGULATORY_TAX_ID = "Regulatory Tax ID", // like an "official" company (something with a Tax ID)
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

export enum TimeEntryCategory {
  MISC_MEETINGS = "Misc Meetings",
  MISC_OTHER = "Misc Other",
  MISC_VACATION = "Misc Vacation",
  MISC_WORK_ITEM = "Misc Work Item",
  PACKAGE = "Package",
  PROJECT = "Project",
  REQUEST = "Request",
  TASK = "Task",
}

export enum RaciMatrixSubject {
  PROJECT_LEADERSHIP = "Project Leadership",
  PROJECT_MANAGEMENT = "Project Management",
  APPLICATION_DEVELOPMENT = "Application Development",
  DEV_OPERATIONS = "Dev Operations",
  QUALITY_ASSURANCE = "Quality Assurance",
  SEARCH_ENGINE_OPTIMIZATION = "Search Engine Optimization",
  USER_INTERFASE_USABILITY = "User Interfase And Usability",
  BUSINESS_ANALYST = "Business Analyst (Abm)",
  CURATION_COORDINATION = "Curation Coordination",
  KNOWLEDGE_REPRESENTATION = "Knowledge Representation",
  MARKETING_OUTREACH = "Marketing Outreach",
  CURATION_WORKS = "Curation Works",
}

/**
 * Reference URL: https://advisera.com/27001academy/blog/2018/11/05/raci-matrix-for-iso-27001-implementation-project/
 */

export enum RaciMatrixAssignmentNature {
  RESPONSIBLE = "Responsible",
  ACCOUNTABLE = "Accountable",
  CONSULTED = "Consulted",
  INFORMED = "Informed",
}

// TODO:
// - [ ] Need to update it to the standard way with the skill registry url

export enum SkillNature {
  SOFTWARE = "Software",
  HARDWARE = "Hardware",
}

export enum Skill {
  ANGULAR = "Angular",
  DENO = "Deno",
  TYPESCRIPT = "Typescript",
  POSTGRESQL = "Postgresql",
  MYSQL = "Mysql",
  HUGO = "Hugo",
  PHP = "Php",
  JAVASCRIPT = "JavaScript",
  PYTHON = "Python",
  DOT_NET = ".Net",
  ORACLE = "Oracle",
  JAVA = "Java",
  JQUERY = "JQuery",
  OSQUERY = "Osquery",
  REACTJS = "ReactJs",
}

/**
 * Reference URL: https://hr.nih.gov/about/faq/working-nih/competencies/what-nih-proficiency-scale
 */
export enum ProficiencyScale {
  NA = "Not Applicable",
  FUNDAMENTAL_AWARENESS = "Fundamental Awareness (basic knowledge)",
  NOVICE = "Novice (limited experience)",
  INTERMEDIATE = "Intermediate (practical application)",
  ADVANCED = "Advanced (applied theory)",
  EXPERT = "Expert (recognized authority)",
}

/**
 * Reference URL: https://source.whitehatsec.com/help/sentinel/secops/vulnerability-status.html
 */
export enum VulnerabilityStatus {
  OPEN = "Open",
  CLOSED = "Closed",
  ACCEPTED = "Accepted",
  OUT_OF_SCOPE = "Out of Scope",
  MITIGATED = "Mitigated",
  INVALID = "Invalid",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_asset_status_enum.html
 */
export enum AssetStatus {
  AWAITING_RECEIPT = "Awaiting Receipt",
  IN_STOCK = "In Stock",
  IN_USE = "In Use",
  MISSING = "Missing",
  RETIRED = "Retired",
  RETURNED_FOR_MAINTENANCE = "Returned For Maintenance",
  RETURNED_TO_SUPPLIER = "Returned To Supplier	",
  UNDEFINED = "Undefined",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum AssetType {
  ACCOUNT = "Account",
  BUSINESS_SERVICE = "Business Service",
  CABLE = "Cable",
  CABLE_DEVICE = "Cable Device",
  COLLECTIVE_EQUIPMENT = "Collective Equipment",
  COMPUTER = "Computer",
  CPU = "Cpu",
  DOMAIN = "Domain",
  SERVER = "Server",
  EXTENSION_CARD = "Extension Card",
  GLOBAL_SOFTWARE_LICENSE = "Global Software License",
  LAPTOP = "Laptop",
  LASER_PRINTER = "Laser Printer",
  LICENSE_CONTRACT = "License Contract",
  MAINTENANCE_CONTRACT = "Maintenance Contract",
  MASS_STORAGE = "Mass Storage",
  MOBILE_DEVICE = "Mobile Device",
  MONITOR = "Monitor",
  NETWORK_HARDWARE = "Network Hardware",
  NETWORK_INTERFACE = "Network Interface",
  OEM_SOFTWARE_LICENSE = "Oem Software License",
  PRINTER = "Printer",
  RACKMOUNT_MONITOR = "Rackmount Monitor",
  SCANNER = "Scanner",
  SOFTWARE_ACCESS_AUTHORIZATION = "Software Access Authorization",
  SOFTWARE_ACCESS_REMOVAL = "Software Access Removal",
  SOFTWARE_ADD_WORK_ORDER = "Software Add Work Order",
  SOFTWARE_INSTALLATION = "Software Installation",
  SOFTWARE_LICENSE = "Software License",
  SOFTWARE_REMOVAL_WORK_ORDER = "Software Removal Work Order",
  STANDARD_ASSET = "Standard Asset",
  TELECOMMUNICATION_EQUIPMENT = "Telecommunication Equipment",
  TELEPHONE = "Telephone",
  VIRTUAL_MACHINE = "Virtual Machine",
  SECURITY_POLICY = "Security Policy",
  EMPLOYEE_DATA = "Employee Data",
  API = "Api",
  FIREWALL = "Firewall",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum Assignment {
  AWAITING_RECEIPT = "Awaiting receipt",
  IN_STOCK = "In Stock",
  IN_USE = "In Use",
  MISSING = "Missing",
  RETURNED_FOR_MAINTENANCE = "Returned For Maintenance",
  RETURNED_TO_SUPPLIER = "Returned To Supplier",
}

export enum Probability {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

/**
 * Reference URL:
https://www.imperva.com/learn/application-security/cyber-security-threats/
https://www.imperva.com/learn/application-security/cyber-security-threats/
https://www.cisa.gov/uscert/ics/content/cyber-threat-source-descriptions
https://www.fortinet.com/resources/cyberglossary/threat-protection
https://www.code42.com/glossary/types-of-insider-threats/
https://www.fortinet.com/resources/cyberglossary/what-is-hacktivism
https://owasp.org/www-project-top-ten/
*/

export enum ThreatSourceType {
  PHISHING = "Phishing",
  SPAM = "Spam",
  SPYWARE_AND_MALWARE_FOR_EXTORTION = "Spyware and malware for extortion",
  THEFT_OF_PRIVATE_INFORMATION = "Theft of private information",
  ONLINE_SCAMS = "Online scams",
  DESTROY_OR_ABUSE_CRITICAL_INFRASTRUCTURE =
    "Destroy or abuse critical infrastructure",
  THREATEN_NATIONAL_SECURITY = "Threaten national security",
  DISRUPT_ECONOMIES = "Disrupt economies",
  CAUSE_BODILY_HARM_TO_CITIZENS = "Cause bodily harm to citizens",
  DENIAL_OF_SERVICE_ATTACKS = "Denial-of-Service Attacks",
  DOXING = "Doxing",
  LEAKING_INFORMATION = "Leaking Information",
  THE_USE_OF_THE_SOFTWARE_RECAP = "The Use of the Software RECAP",
  BLOGGING_ANONYMOUSLY = "Blogging Anonymously",
  GEO_BOMBING = "Geo-bombing",
  WEBSITE_MIRRORING = "Website Mirroring",
  CHANGING_THE_CODE_FOR_WEBSITES_OR_WEBSITE_DEFACEMENTS =
    "Changing the Code for Websites or website defacements",
}

export enum ThreatEventType {
  VIRUSES = "Viruses",
  WORMS = "Worms",
  TROJANS = "Trojans",
  RANSOMWARE = "Ransomware",
  CRYPTOJACKING = "Cryptojacking",
  SPYWARE = "Spyware",
  ADWARE = "Adware",
  FILELESS_MALWARE = "Fileless malware",
  ROOTKITS = "Rootkits",
  BAITING = "Baiting",
  PRETEXTING = "Pretexting",
  PHISHING = "Phishing",
  VISHING = "Vishing",
  SMISHING = "Smishing",
  PIGGYBACKING = "Piggybacking",
  TAILGATING = "Tailgating",
  EMAIL_HIJACKING = "Email Hijacking",
  DNS_SPOOFING = "DNS spoofing",
  IP_SPOOFING = "IP spoofing",
  HTTPS_SPOOFING = "HTTPS spoofing",
  HTTP_FLOOD_DDOS = "HTTP flood DDoS",
  SYN_FLOOD_DDOS = "SYN flood DDoS",
  UDP_FLOOD_DDOS = "UDP flood DDoS",
  ICMP_FLOOD = "ICMP flood",
  NTP_AMPLIFICATION = "NTP amplification",
  SQL_INJECTION = "SQL injection",
  CODE_INJECTION = "Code injection",
  OS_COMMAND_INJECTION = "OS Command Injection",
  LDAP_INJECTION = "LDAP injection",
  XML_EXTERNAL_ENTITIES_INJECTION = "XML eXternal Entities (XXE) Injection",
  CROSS_SITE_SCRIPTING = "Cross Site Scripting (XSS)",
  BROKEN_ACCESS_CONTROL = "Broken Access Control",
  CRYPTOGRAPHIC_FAILURES = "Cryptographic Failures",
  INSECURE_DESIGN = "Insecure Design",
  SECURITY_MISCONFIGURATION = "Security Misconfiguration",
  VULNERABLE_AND_OUTDATED_COMPONENTS = "Vulnerable and Outdated Components",
  IDENTIFICATION_AND_AUTHENTICATION_FAILURES =
    "Identification and Authentication Failures",
  SOFTWARE_AND_DATA_INTEGRITY_FAILURES = "Software and Data Integrity Failures",
  SECURITY_LOGGING_AND_MONITORING_FAILURES =
    "Security Logging and Monitoring Failures",
  SERVER_SIDE_REQUEST_FORGERY = "Server Side Request Forgery",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_calendar_period_enum.html
 */
export enum CalendarPeriod {
  TWENTY_FOUR_HOURS_SEVEN_DAYS = "24x7",
  BUSINESS_HOURS = "Business hours",
  NON_BUSINESS_HOURS = "Non-business hours",
}
/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_comparison_operator_enum.html
 */
export enum ComparisonOperator {
  GREATER_THAN = "<",
  GREATER_THAN_EQUAL_TO = "<=",
  EQUAL_TO = "=",
  LESS_THAN = ">",
  LESS_THAN_EQUAL_TO = ">=",
  NA = "na",
}
/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_kpi_measurement_type_enum.html
 */
export enum KpiMeasurementType {
  BANDWIDTH = "Bandwidth",
  CAPACITY = "Capacity",
  CURRENCY = "Currency",
  PERCENTAGE = "Percentage",
  TIME = "Time",
  UNITLESS = "Unitless",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_kpi_status_enum.html
 */
export enum KpiStatus {
  CRITICAL = "Critical",
  MAJOR = "Major",
  MINOR = "Minor",
  OK = "Ok",
  WARNING = "Warning",
}
/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_tracking_period_enum.html
 */
export enum TrackingPeriod {
  DAY = "Day",
  HOUR = "Hour",
  MONTH = "Month",
  OTHER = "Other",
  QUARTER = "Quarter",
  WEEK = "Week",
  YEAR = "Year",
}
/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_trend_enum.html
 */
export enum Trend {
  DOWN = "Down",
  NO_CHANGE = "No Change	",
  UP = "Up",
}

export enum AuditorType {
  EXTERNAL = "external",
  INTERNAL = "internal",
}

export enum AuditPurpose {
  MEANING_DRY_RUN = "exmeaning dry runternal",
  OFFICIAL = "official",
}

export enum AuditorStatusType {
  OUTSTANDING = "Outstanding",
  FULFILLED = "Fulfilled",
  REJECTED = "Rejected",
  ACCEPTED = "Accepted",
}

export enum EthernetInterfaceType {
  ETH0 = "eth0",
  ETH1 = "eth1",
  WLAN0 = "wlan0",
  ENP2 = "enp2s0f0",
  EN01 = "eno1",
  ENP41 = "enp41s0",
  ENP195 = "enp195s0 ",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_contract_status_enum.html
 */

export enum ContractStatus {
  ACTIVE = "Active",
  AWAITING_APPROVAL = "Awaiting Approval",
  AWAITING_APPROVAL_FOR_RENEWAL = "Awaiting Approval For Renewal",
  CANCELED = "Canceled",
  DENIED = "Denied",
  FINISHED = "Finished",
  IN_PREPARATION = "In Preparation",
  QUOTE_REQUESTED = "Quote Requested",
  QUOTED = "Quoted",
  STANDARD_CONTRACT = "Standard Contract",
  SUSPENDED = "Suspended",
  VALIDATED = "Validated",
}

export enum GraphNature {
  SERVICE = "Service",
  APP = "Application",
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

const contractStatus = gm.textEnumTable(
  "contract_status",
  ContractStatus,
  { isIdempotent: true },
);

const paymentType = gm.textEnumTable(
  "payment_type",
  PaymentType,
  { isIdempotent: true },
);

const periodicity = gm.textEnumTable(
  "periodicity",
  Periodicity,
  { isIdempotent: true },
);

const boundaryNature = gm.textEnumTable(
  "boundary_nature",
  BoundaryNature,
  { isIdempotent: true },
);

const timeEntryCategory = gm.textEnumTable(
  "time_entry_category",
  TimeEntryCategory,
  { isIdempotent: true },
);

const raciMatrixSubject = gm.textEnumTable(
  "raci_matrix_subject",
  RaciMatrixSubject,
  { isIdempotent: true },
);

const raciMatrixAssignmentNature = gm.textEnumTable(
  "raci_matrix_assignment_nature",
  RaciMatrixAssignmentNature,
  { isIdempotent: true },
);

const skillNature = gm.textEnumTable(
  "skill_nature",
  SkillNature,
  { isIdempotent: true },
);

const skill = gm.textEnumTable(
  "skill",
  Skill,
  { isIdempotent: true },
);

const proficiencyScale = gm.textEnumTable(
  "proficiency_scale",
  ProficiencyScale,
  { isIdempotent: true },
);

const vulnerabilityStatus = gm.textEnumTable(
  "vulnerability_status",
  VulnerabilityStatus,
  { isIdempotent: true },
);

const assetStatus = gm.textEnumTable(
  "asset_status",
  AssetStatus,
  { isIdempotent: true },
);

const assetType = gm.textEnumTable(
  "asset_type",
  AssetType,
  { isIdempotent: true },
);

const assignment = gm.textEnumTable(
  "assignment",
  Assignment,
  { isIdempotent: true },
);

const probability = gm.textEnumTable(
  "probability",
  Probability,
  { isIdempotent: true },
);

const threatSourceType = gm.textEnumTable(
  "threat_source_type",
  ThreatSourceType,
  { isIdempotent: true },
);

const threatEventType = gm.textEnumTable(
  "threat_event_type",
  ThreatEventType,
  { isIdempotent: true },
);

const calendarPeriod = gm.textEnumTable(
  "calendar_period",
  CalendarPeriod,
  { isIdempotent: true },
);

const comparisonOperator = gm.textEnumTable(
  "comparison_operator",
  ComparisonOperator,
  { isIdempotent: true },
);

const kpiMeasurementType = gm.textEnumTable(
  "kpi_measurement_type",
  KpiMeasurementType,
  { isIdempotent: true },
);

const kpiStatus = gm.textEnumTable(
  "kpi_status",
  KpiStatus,
  { isIdempotent: true },
);

 const trackingPeriod = gm.textEnumTable(
   "tracking_period",
    TrackingPeriod,
    { isIdempotent: true },
);

 const trend = gm.textEnumTable(
   "trend",
    Trend,
    { isIdempotent: true },
);

 const auditorType = gm.textEnumTable(
   "auditor_type",
    AuditorType,
    { isIdempotent: true },
);

 const auditPurpose = gm.textEnumTable(
   "audit_purpose",
    AuditPurpose,
    { isIdempotent: true },
);

const auditorStatusType = gm.textEnumTable(
   "audit_status",
    AuditorStatusType,
    { isIdempotent: true },
);

const ethernetInterfaceType = gm.textEnumTable(
   "ethernet_interface",
    EthernetInterfaceType,
    { isIdempotent: true },
);

const partyIdentifierType = gm.textEnumTable(
   "party_identifier_type",
    PartyIdentifierType,
    { isIdempotent: true },
);

const partyRelationType = gm.textEnumTable(
   "party_relation_type",
    PartyRelationType,
    { isIdempotent: true },
);

const personType = gm.textEnumTable(
   "person_type",
    PersonType,
    { isIdempotent: true },
);

const contactType = gm.textEnumTable(
   "contact_type",
    ContactType,
    { isIdempotent: true },
);

const trainingSubject = gm.textEnumTable(
   "training_subject",
    TrainingSubject,
    { isIdempotent: true },
);

const statusValues = gm.textEnumTable(
   "status_value",
    StatusValues,
    { isIdempotent: true },
);

const ratingValue = gm.textEnumTable(
   "rating_value",
    RatingValue,
    { isIdempotent: true },
);

const contractType = gm.textEnumTable(
   "contract_type",
    ContractType,
    { isIdempotent: true },
);

const graphNature = gm.textEnumTable(
   "graph_nature",
    GraphNature,
    { isIdempotent: true },
);

const graph = gm.textPkTable("graph", {
  graph_id: primaryKey(),
  graph_nature_id: graphNature.references.code(),
  name:text(),
  description:textNullable(),
  ...gm.housekeeping.columns,
});

const boundaryId = primaryKey();
const boundary = gm.textPkTable("boundary", {
  boundary_id: boundaryId,
  graph_id: graph.references.graph_id(),
  boundary_nature_id: boundaryNature.references.code(),
  name: text(),
  description:textNullable(),
  ...gm.housekeeping.columns,
});

const host = gm.textPkTable("host", {
  host_id: primaryKey(),
  host_name: text(),
  description:textNullable(),
  ...gm.housekeeping.columns,
});

const hostBoundary = gm.textPkTable("host_boundary", {
  host_boundary_id: primaryKey(),
  host_id: host.references.host_id(),
  ...gm.housekeeping.columns,
})

const raciMatrix = gm.textPkTable("raci_matrix", {
  raci_matrix_id: primaryKey(),
  asset: text(),
  responsible: text(),
  accountable: text(),
  consulted: text(),
  informed: text(),
  ...gm.housekeeping.columns,
})

const raciMatrixSubjectBoundary = gm.textPkTable("raci_matrix_subject_boundary", {
  raci_matrix_subject_boundary_id: primaryKey(),
  boundary_id: boundary.references.boundary_id(),
  raci_matrix_subject_id: raciMatrixSubject.references.code(),
  ...gm.housekeeping.columns,
})

const raciMatrixActivity = gm.textPkTable("raci_matrix_activity", {
  raci_matrix_activity_id: primaryKey(),
  activity: text(),
  ...gm.housekeeping.columns,
})

const party = SQLa.tableDefinition("party", {
  party_id: primaryKey(),
  party_type_id: partyType.references.code(),
  party_name: text(),
  ...gm.housekeeping.columns,
});

/**
  * Reference URL: https://help.salesforce.com/s/articleView?id=sf.c360_a_partyidentification_object.htm&type=5
*/

const partyIdentifier = SQLa.tableDefinition("party_identifier", {
  party_identifier_id: primaryKey(),
  identifier_number: text(),
  party_identifier_type_id: partyIdentifierType.references.code(),
  party_id: party.references.party_id(),
  ...gm.housekeeping.columns,
});

const person = SQLa.tableDefinition("person", {
  person_id: primaryKey(),
  party_id: party.references.party_id(),
  person_type_id: personType.references.code(),
  person_first_name: text(),
  person_last_name: text(),
  ...gm.housekeeping.columns,
});

/**
   * Reference URL: https://docs.oracle.com/cd/E29633_01/CDMRF/GUID-F52E49F4-AE6F-4FF5-8EEB-8366A66AF7E9.htm
*/

const partyRelation = SQLa.tableDefinition("party_relation", {
  party_relation_id: primaryKey(),
  party_id: party.references.party_id(),
  related_party_id: party.references.party_id(),
  relation_type_id: partyRelationType.references.code(),
  party_role_id: partyRole.references.code(),
  ...gm.housekeeping.columns,
});

const organization = SQLa.tableDefinition("organization", {
  organization_id: primaryKey(),
  party_id: party.references.party_id(),
  name: text(),
  license: text(),
  registration_date:date(),
  ...gm.housekeeping.columns,
});

const organizationRole = SQLa.tableDefinition("organization_role", {
  organization_role_id: primaryKey(),
  person_id: person.references.person_id(),
  organization_id: organization.references.organization_id(),
  organization_role_type_id: organizationRoleType.references.code(),
  ...gm.housekeeping.columns,
});

const contactElectronic = SQLa.tableDefinition("contact_electronic", {
  contact_electronic_id: primaryKey(),
  contact_type_id: contactType.references.code(),
  party_id: party.references.party_id(),
  electronics_details: text(),
  ...gm.housekeeping.columns,
});

const contactLand = SQLa.tableDefinition("contact_land", {
  contact_land_id: primaryKey(),
  contact_type_id: contactType.references.code(),
  party_id: party.references.party_id(),
  address_line1: text(),
  address_line2: text(),
  address_zip: text(),
  address_city: text(),
  address_state: text(),
  address_country: text(),
  ...gm.housekeeping.columns,
});

 /**
   * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
   */

const asset = SQLa.tableDefinition("asset", {
  asset_id: primaryKey(),
  organization_id: organization.references.organization_id(),
  asset_retired_date: dateNullable(),
  asset_status_id: assetStatus.references.code(),
  asset_tag: text(),
  name: text(),
  description: text(),
  asset_type_id: assetType.references.code(),
  asset_workload_category: text(),
  assignment_id: assignment.references.code(),
  barcode_or_rfid_tag: text(),
  installed_date: dateNullable(),
  planned_retirement_date: dateNullable(),
  purchase_delivery_date: dateNullable(),
  purchase_order_date: dateNullable(),
  purchase_request_date: dateNullable(),
  serial_number: text(),
  tco_amount: text(),
  tco_currency: text(),
  ...gm.housekeeping.columns,
});

const billing = SQLa.tableDefinition("billing", {
  billing_id: primaryKey(),
  purpose: text(),
    bill_rate: text(),
    period: text(),
    effective_from_date: dateTime(),
    effective_to_date: text(),
    prorate: integer(),
  ...gm.housekeeping.columns,
});

function sqlDDL(options: {
  destroyFirst?: boolean;
  schemaName?: string;
} = {}) {
  const { destroyFirst, schemaName } = options;

  // NOTE: every time the template is "executed" it will fill out tables, views
  //       in gm.tablesDeclared, etc.
  // deno-fmt-ignore
  return SQLa.SQL<EmitContext>(gts.ddlOptions)`
    ${execCtx}
    ${organizationRoleType}
    ${partyType}
    ${partyRole}
    ${contractStatus}
    ${paymentType}
    ${periodicity}
    ${boundaryNature}
    ${timeEntryCategory}
    ${raciMatrixSubject}
    ${raciMatrixAssignmentNature}
    ${skillNature}
    ${skill}
    ${proficiencyScale}
    ${vulnerabilityStatus}
    ${assetStatus}
    ${assetType}
    ${assignment}
    ${probability}
    ${threatSourceType}
    ${threatEventType}
    ${calendarPeriod}
    ${comparisonOperator}
    ${kpiMeasurementType}
    ${kpiStatus}
    ${trackingPeriod}
    ${trend}
    ${auditorType}
    ${auditPurpose}
    ${auditorStatusType}
    ${ethernetInterfaceType}
    ${partyRelationType}
    ${partyIdentifierType}
    ${personType}
    ${contactType}
    ${trainingSubject}
    ${statusValues}
    ${ratingValue}
    ${contractType}
    ${graphNature}
    ${graph}
    ${host}
    ${hostBoundary}
    ${raciMatrix}
    ${raciMatrixSubjectBoundary}
    ${raciMatrixActivity}
    ${party}
    ${partyIdentifier}
    ${person}
    ${partyRelation}
    ${organization}
    ${organizationRole}
    ${contactElectronic}
    ${contactLand}
    ${asset}
    ${billing}

    ${execCtx.seedDML}
    ${organizationRoleType.seedDML}
    ${partyType.seedDML}
    ${partyRole.seedDML}
    ${contractStatus.seedDML}
    ${paymentType.seedDML}
    ${periodicity.seedDML}
    ${boundaryNature.seedDML}
    ${timeEntryCategory.seedDML}
    ${raciMatrixSubject.seedDML}
    ${raciMatrixAssignmentNature.seedDML}
    ${skillNature.seedDML}
    ${skill.seedDML}
    ${proficiencyScale.seedDML}
    ${vulnerabilityStatus.seedDML}
    ${assetStatus.seedDML}
    ${assetType.seedDML}
    ${assignment.seedDML}
    ${probability.seedDML}
    ${threatSourceType.seedDML}
    ${calendarPeriod.seedDML}
    ${comparisonOperator.seedDML}
    ${kpiMeasurementType.seedDML}
    ${kpiStatus.seedDML}
    ${trackingPeriod.seedDML}
    ${trend.seedDML}
    ${auditorType.seedDML}
    ${auditPurpose.seedDML}
    ${auditorStatusType.seedDML}
    ${ethernetInterfaceType.seedDML}
    ${partyIdentifierType.seedDML}
    ${partyRelationType.seedDML}
    ${personType.seedDML}
    ${contactType.seedDML}
    ${trainingSubject.seedDML}
    ${statusValues.seedDML}
    ${ratingValue.seedDML}
    ${contractType.seedDML}
    ${graphNature .seedDML}
    `;
}

tp.typicalCLI({
  resolve: (specifier) =>
    specifier ? import.meta.resolve(specifier) : import.meta.url,
  prepareSQL: (options) => ws.unindentWhitespace(sqlDDL(options).SQL(ctx)),
  prepareDiagram: () => {
    // "executing" the following will fill gm.tablesDeclared but we don't
    // care about the SQL output, just the state management (tablesDeclared)
    sqlDDL().SQL(ctx);
    return gts.pumlERD(ctx).content;
  },
}).commands.parse(Deno.args);
