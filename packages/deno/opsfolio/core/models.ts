#!/usr/bin/env -S deno run --allow-all

import * as mod from "https://raw.githubusercontent.com/netspective-labs/sql-aide/v0.0.33/pattern/typical/mod.ts";
const { SQLa, ws } = mod;

export const ctx = SQLa.typicalSqlEmitContext();
type EmitContext = typeof ctx;

const gts = mod.governedTemplateState<mod.GovernedDomain, EmitContext>();
const gm = mod.governedModel<mod.GovernedDomain, EmitContext>(gts.ddlOptions);
const {
  text,
  textNullable,
  integer,
  date,
  dateNullable,
  dateTime,
  selfRef,
  dateTimeNullable,
  float,
} = gm.domains;
const { autoIncPrimaryKey: autoIncPK } = gm.keys;
type Any = any;
const tcf = SQLa.tableColumnFactory<Any, Any>();

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

export enum Severity {
  CRITICAL = "Critical",
  MAJOR = "Major",
  MINOR = "Minor",
  LOW = "Low",
}

export enum AssetRiskType {
  SECURITY = "Security",
}

enum Priority {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export enum RiskSubject {
  TECHNICAL_RISK = "Technical Risk",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

export enum IncidentCategory {
  ACCESS = "Access",
  DATA = "Data",
  FACILITIES = "Facilities",
  FAILURE = "Failure",
  GENERAL_INFORMATION = "General Information",
  HARDWARE = "Hardware",
  HOW_TO = "How To",
  OTHER = "Other",
  PERFORMANCE = "Performance",
  SECURITY = "Security",
  SERVICE_DELIVERY = "Service Delivery",
  SERVICE_PORTFOLIO = "Service Portfolio",
  STATUS = "Status",
  SUPPORT = "Support",
  THRIFTY = "Thrifty",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum IncidentSubCategory {
  AUTHORIZATION_ERROR = "Authorization Error",
  AVAILABILITY = "Availability",
  DATA_OR_FILE_CORRUPTED = "Data Or File Corrupted",
  DATA_OR_FILE_INCORRECT = "Data Or File Incorrect",
  DATA_OR_FILE_MISSING = "Data Or File Missing",
  ERROR_MESSAGE = "Error Message",
  FUNCTION_OR_FEATURE_NOT_WORKING = "Function Or Feature Not Working",
  FUNCTIONALITY = "Functionality",
  GENERAL_INFORMATION = "General Information",
  HARDWARE_FAILURE = "Hardware Failure",
  HOW_TO = "How To",
  INCIDENT_RESOLUTION_QUALITY = "Incident Resolution Quality",
  INCIDENT_RESOLUTION_TIME = "Incident Resolution Time",
  JOB_FAILED = "Job Failed",
  LOGIN_FAILURE = "Login Failure",
  MISSING_OR_STOLEN = "Missing Or Stolen",
  NEW_SERVICE = "New Service",
  PERFORMANCE = "Performance",
  PERFORMANCE_DEGRADATION = "Performance Degradation",
  PERSON = "Person",
  SECURITY_BREACH = "Security Breach",
  SECURITY_EVENT = "Security Event/Message",
  STATUS = "Status",
  STORAGE_LIMIT_EXCEEDED = "Storage Limit Exceeded",
  SYSTEM_DOWN = "System Down",
  SYSTEM_OR_APPLICATION_HANGS = "System Or Application Hangs",
  UPGRADE_NEW_RELEASE = "Upgrade/New Release",
  VIRUS_ALERT = "Virus Alert",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum IncidentType {
  COMPLAINT = "Complaint",
  INCIDENT = "Incident",
  REQUEST_FOR_INFORMATION = "Request For Information",
}

/**
 * Reference URL:https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum IncidentStatus {
  ACCEPTED = "Accepted",
  ASSIGNED = "Assigned",
  CANCELLED = "Cancelled",
  CATEGORIZE = "Categorize",
  CLOSED = "Closed",
  OPEN = "Open",
  PENDING_CHANGE = "Pending Change",
  PENDING_CUSTOMER = "Pending Customer",
  PENDING_EVIDENCE = "Pending Evidence",
  PENDING_OTHER = "Pending Other",
  PENDING_VENDOR = "Pending Vendor",
  REFERRED = "Referred",
  REJECTED = "Rejected",
  REOPENED = "Reopened",
  REPLACED_PROBLEM = "Replaced Problem",
  RESOLVED = "Resolved",
  SUSPENDED = "Suspended",
  WORK_IN_PROGRESS = "Work In Progress",
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

const severity = gm.textEnumTable(
  "severity",
  Severity,
  { isIdempotent: true },
);

const assetRiskType = gm.textEnumTable(
  "asset_risk_type",
  AssetRiskType,
  { isIdempotent: true },
);

const priority = gm.textEnumTable(
  "priority",
  Priority,
  { isIdempotent: true },
);

const riskSubject = gm.textEnumTable(
  "risk_subject",
  RiskSubject,
  { isIdempotent: true },
);

const riskType = gm.textEnumTable(
  "risk_type",
  RiskType,
  { isIdempotent: true },
);

const incidentCategory = gm.textEnumTable(
  "incident_category",
  IncidentCategory,
  { isIdempotent: true },
);

const incidentSubCategory = gm.textEnumTable(
  "incident_sub_category",
  IncidentSubCategory,
  { isIdempotent: true },
);

const incidentType = gm.textEnumTable(
  "incident_type",
  IncidentType,
  { isIdempotent: true },
);

const incidentStatus = gm.textEnumTable(
  "incident_status",
  IncidentStatus,
  { isIdempotent: true },
);

export const graph = gm.autoIncPkTable("graph", {
  graph_id: autoIncPK(),
  graph_nature_code: graphNature.references.code(),
  name: text(),
  description: textNullable(),
  ...gm.housekeeping.columns,
});

const boundary_id = autoIncPK();
export const boundary = gm.autoIncPkTable("boundary", {
  boundary_id,
  parent_boundary_id: selfRef(boundary_id),
  boundary_nature_id: boundaryNature.references.code(),
  name: text(),
  description: textNullable(),
  ...gm.housekeeping.columns,
});

export const host = gm.autoIncPkTable("host", {
  host_id: autoIncPK(),
  host_name: tcf.unique(text()),
  description: textNullable(),
  ...gm.housekeeping.columns,
});

export const hostBoundary = gm.autoIncPkTable("host_boundary", {
  host_boundary_id: autoIncPK(),
  host_id: host.references.host_id(),
  ...gm.housekeeping.columns,
});

export const raciMatrix = gm.autoIncPkTable("raci_matrix", {
  raci_matrix_id: autoIncPK(),
  asset: text(),
  responsible: text(),
  accountable: text(),
  consulted: text(),
  informed: text(),
  ...gm.housekeeping.columns,
});

const raciMatrixSubjectBoundary = gm.autoIncPkTable(
  "raci_matrix_subject_boundary",
  {
    raci_matrix_subject_boundary_id: autoIncPK(),
    boundary_id: boundary.references.boundary_id(),
    raci_matrix_subject_id: raciMatrixSubject.references.code(),
    ...gm.housekeeping.columns,
  },
);

const raciMatrixActivity = gm.autoIncPkTable("raci_matrix_activity", {
  raci_matrix_activity_id: autoIncPK(),
  activity: text(),
  ...gm.housekeeping.columns,
});

export const party = gm.autoIncPkTable("party", {
  party_id: autoIncPK(),
  party_type_id: partyType.references.code(),
  party_name: text(),
  ...gm.housekeeping.columns,
});

/**
 * Reference URL: https://help.salesforce.com/s/articleView?id=sf.c360_a_partyidentification_object.htm&type=5
 */

const partyIdentifier = gm.autoIncPkTable("party_identifier", {
  party_identifier_id: autoIncPK(),
  identifier_number: text(),
  party_identifier_type_id: partyIdentifierType.references.code(),
  party_id: party.references.party_id(),
  ...gm.housekeeping.columns,
});

const person = gm.autoIncPkTable("person", {
  person_id: autoIncPK(),
  party_id: party.references.party_id(),
  person_type_id: personType.references.code(),
  person_first_name: text(),
  person_last_name: text(),
  ...gm.housekeeping.columns,
});

/**
 * Reference URL: https://docs.oracle.com/cd/E29633_01/CDMRF/GUID-F52E49F4-AE6F-4FF5-8EEB-8366A66AF7E9.htm
 */

const partyRelation = gm.autoIncPkTable("party_relation", {
  party_relation_id: autoIncPK(),
  party_id: party.references.party_id(),
  related_party_id: party.references.party_id(),
  relation_type_id: partyRelationType.references.code(),
  party_role_id: partyRole.references.code(),
  ...gm.housekeeping.columns,
});

const organization = gm.autoIncPkTable("organization", {
  organization_id: autoIncPK(),
  party_id: party.references.party_id(),
  name: text(),
  license: text(),
  registration_date: date(),
  ...gm.housekeeping.columns,
});

const organizationRole = gm.autoIncPkTable("organization_role", {
  organization_role_id: autoIncPK(),
  person_id: person.references.person_id(),
  organization_id: organization.references.organization_id(),
  organization_role_type_id: organizationRoleType.references.code(),
  ...gm.housekeeping.columns,
});

const contactElectronic = gm.autoIncPkTable("contact_electronic", {
  contact_electronic_id: autoIncPK(),
  contact_type_id: contactType.references.code(),
  party_id: party.references.party_id(),
  electronics_details: text(),
  ...gm.housekeeping.columns,
});

const contactLand = gm.autoIncPkTable("contact_land", {
  contact_land_id: autoIncPK(),
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

const asset = gm.autoIncPkTable("asset", {
  asset_id: autoIncPK(),
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

const vulnerabilitySource = gm.autoIncPkTable("vulnerability_source", {
  vulnerability_source_id: autoIncPK(),
  short_code: text(), // For example cve code like CVE-2019-0708 (corresponds to a flaw in Microsoft’s Remote Desktop Protocol (RDP))
  source_url: text(),
  description: text(),
  ...gm.housekeeping.columns,
});

// TODO:
// - [ ] Need add field tag if needed in future

const vulnerability = gm.autoIncPkTable("vulnerability", {
  vulnerability_id: autoIncPK(),
  short_name: text(),
  source_id: vulnerabilitySource.references.vulnerability_source_id(),
  affected_software: text(),
  reference: text(),
  status_id: vulnerabilityStatus.references.code(),
  patch_availability: text(),
  severity_id: severity.references.code(),
  solutions: text(),
  description: text(),
  ...gm.housekeeping.columns,
});

const threatSource = gm.autoIncPkTable("threat_source", {
  threat_source_id: autoIncPK(),
  title: text(),
  identifier: text(),
  threat_source_type_id: threatSourceType.references.code(),
  source_of_information: text(),
  capability: text(),
  intent: text(),
  targeting: text(),
  description: text(),
  ...gm.housekeeping.columns,
});

const threatEvent = gm.autoIncPkTable("threat_event", {
  threat_event_id: autoIncPK(),
  title: text(),
  threat_source_id: threatSource.references.threat_source_id(),
  asset_id: asset.references.asset_id(),
  identifier: text(),
  threat_event_type_id: threatEventType.references.code(),
  event_classification: text(),
  source_of_information: text(),
  description: text(),
  ...gm.housekeeping.columns,
});

const assetRisk = gm.autoIncPkTable("asset_risk", {
  asset_risk_id: autoIncPK(),
  asset_risk_type_id: assetRiskType.references.code(),
  asset_id: asset.references.asset_id(),
  threat_event_id: threatEvent.references.threat_event_id(),
  relevance_id: severity.references.code(),
  likelihood_id: probability.references.code(),
  impact: text(),
  ...gm.housekeeping.columns,
});

const securityImpactAnalysis = gm.autoIncPkTable("security_impact_analysis", {
  security_impact_analysis_id: autoIncPK(),
  vulnerability_id: vulnerability.references.vulnerability_id(),
  asset_risk_id: assetRisk.references.asset_risk_id(),
  risk_level_id: probability.references.code(),
  impact_level_id: probability.references.code(),
  existing_controls: text(),
  priority_id: priority.references.code(),
  reported_date: date(),
  reported_by_id: person.references.person_id(),
  responsible_by_id: person.references.person_id(),
  ...gm.housekeeping.columns,
});

const impactOfRisk = gm.autoIncPkTable("impact_of_risk", {
  impact_of_risk_id: autoIncPK(),
  security_impact_analysis_id: securityImpactAnalysis.references
    .security_impact_analysis_id(),
  impact: text(),
  ...gm.housekeeping.columns,
});

const proposedControls = gm.autoIncPkTable("proposed_controls", {
  proposed_controls_id: autoIncPK(),
  security_impact_analysis_id: securityImpactAnalysis.references
    .security_impact_analysis_id(),
  controls: text(),
  ...gm.housekeeping.columns,
});

const billing = gm.autoIncPkTable("billing", {
  billing_id: autoIncPK(),
  purpose: text(),
  bill_rate: text(),
  period: text(),
  effective_from_date: dateTime(),
  effective_to_date: text(),
  prorate: integer(),
  ...gm.housekeeping.columns,
});

const scheduledTask = gm.autoIncPkTable("scheduled_task", {
  scheduled_task_id: autoIncPK(),
  description: text(),
  task_date: dateTime(),
  reminder_date: dateTime(),
  assigned_to: text(),
  reminder_to: text(),
  ...gm.housekeeping.columns,
});

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

const timesheet = gm.autoIncPkTable("timesheet", {
  timesheet_id: autoIncPK(),
  date_of_work: dateTime(),
  is_billable_id: statusValues.references.code(),
  number_of_hours: integer(),
  time_entry_category_id: timeEntryCategory.references.code(),
  timesheet_summary: text(),
  ...gm.housekeeping.columns,
});

const certificate = gm.autoIncPkTable("certificate", {
  certificate_id: autoIncPK(),
  certificate_name: text(),
  short_name: text(),
  certificate_category: text(),
  certificate_type: text(),
  certificate_authority: text(),
  validity: text(),
  expiration_date: dateTimeNullable(),
  domain_name: text(),
  key_size: integer(),
  path: text(),
  ...gm.housekeeping.columns,
});

const device = gm.autoIncPkTable("device", {
  device_id: autoIncPK(),
  device_name: text(),
  short_name: text(),
  barcode: text(),
  model: text(),
  serial_number: text(),
  firmware: text(),
  data_center: text(),
  location: text(),
  purpose: text(),
  description: text(),
  ...gm.housekeeping.columns,
});

const securityIncidentResponseTeam = gm.autoIncPkTable(
  "security_incident_response_team",
  {
    security_incident_response_team_id: autoIncPK(),
    training_subject_id: trainingSubject.references.code(),
    person_id: person.references.person_id(),
    organization_id: organization.references.organization_id(),
    training_status_id: statusValues.references.code(),
    attended_date: date(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://schema.org/Rating
 */

const rating = gm.autoIncPkTable(
  "rating",
  {
    rating_id: autoIncPK(),
    author_id: person.references.person_id(),
    rating_given_to_id: organization.references.organization_id(),
    rating_value_id: ratingValue.references.code(),
    best_rating_id: ratingValue.references.code(),
    rating_explanation: text(),
    review_aspect: text(),
    worst_rating_id: ratingValue.references.code(),
    ...gm.housekeeping.columns,
  },
);

const notes = gm.autoIncPkTable(
  "note",
  {
    note_id: autoIncPK(),
    party_id: party.references.party_id(),
    note: text(),
    ...gm.housekeeping.columns,
  },
);

const auditAssertion = gm.autoIncPkTable(
  "audit_assertion",
  {
    audit_assertion_id: autoIncPK(),
    auditor_type_id: auditorType.references.code(),
    audit_purpose_id: auditPurpose.references.code(),
    auditor_org_id: organization.references.organization_id(),
    auditor_person_id: person.references.person_id(),
    auditor_status_type_id: auditorStatusType.references.code(),
    scf_identifier: text(),
    auditor_notes: text(),
    auditor_artifacts: text(),
    assertion_name: text(),
    assertion_description: text(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const loadAverage = gm.autoIncPkTable(
  "load_average",
  {
    load_average_id: autoIncPK(),
    load_average: float(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const diskUsage = gm.autoIncPkTable(
  "disk_usage",
  {
    disk_usage_id: autoIncPK(),
    total_bytes: integer(),
    used_bytes: integer(),
    free_bytes: integer(),
    percent_used: float(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const networkInterface = gm.autoIncPkTable(
  "network_interface",
  {
    network_interface_id: autoIncPK(),
    name: text(),
    ethernet_interface_id: ethernetInterfaceType.references.code(),
    mac_address: text(),
    ip_addresses: text(),
    netmask: text(),
    gateway: text(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const operatingSystem = gm.autoIncPkTable(
  "operating_system",
  {
    operating_system_id: autoIncPK(),
    name: text(),
    version: text(),
    architecture: text(),
    kernel_version: text(),
    boot_time: dateTime(),
    uptime_seconds: integer(),
    load_average_id: loadAverage.references.load_average_id(),
    cpu_usage_percent: float(),
    memory_total_bytes: integer(),
    memory_available_bytes: integer(),
    swap_total_bytes: integer(),
    swap_used_bytes: integer(),
    disk_usage_id: diskUsage.references.disk_usage_id(),
    network_interface_id: networkInterface.references
      .network_interface_id(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const cpu = gm.autoIncPkTable(
  "cpu",
  {
    cpu_id: autoIncPK(),
    name: text(),
    cores: integer(),
    usage_percent: float(),
    load_average_id: loadAverage.references.load_average_id(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const memory = gm.autoIncPkTable(
  "memory",
  {
    memory_id: autoIncPK(),
    total_bytes: integer(),
    available_bytes: integer(),
    used_percent: float(),
    ...gm.housekeeping.columns,
  },
);

const systemInfoMode = gm.autoIncPkTable(
  "systeminfo_mode",
  {
    systeminfo_mode_id: autoIncPK(),
    asymmetric_keys_encryption_enabled_id: statusValues.references
      .code(),
    symmetric_keys_encryption_enabled_id: statusValues.references
      .code(),
    cryptographic_key_encryption_enabled_id: statusValues.references
      .code(),
    mfa_2fa_enabled_id: statusValues.references.code(),
    public_key_encryption_enabled_id: statusValues.references.code(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page
 */

const systemInfo = gm.autoIncPkTable(
  "systeminfo",
  {
    systeminfo_id: autoIncPK(),
    hostname: text(),
    os_id: operatingSystem.references.operating_system_id(),
    cpu_id: cpu.references.cpu_id(),
    memory_id: memory.references.memory_id(),
    platform_id: asset.references.asset_id(),
    systeminfo_mode_id: systemInfoMode.references.systeminfo_mode_id(),
    importance_id: severity.references.code(),
    status_id: assetStatus.references.code(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

const contract = gm.autoIncPkTable(
  "contract",
  {
    contract_id: autoIncPK(),
    contract_from_id: party.references.party_id(),
    contract_to_id: party.references.party_id(),
    contract_status_id: contractStatus.references.code(),
    document_reference: text(),
    payment_type_id: paymentType.references.code(),
    periodicity_id: periodicity.references.code(),
    start_date: dateTime(),
    end_date: dateTimeNullable(),
    contract_type_id: contractType.references.code(),
    date_of_last_review: dateTimeNullable(),
    date_of_next_review: dateTimeNullable(),
    date_of_contract_review: dateTimeNullable(),
    date_of_contract_approval: dateTimeNullable(),
    ...gm.housekeeping.columns,
  },
);

const riskRegister = gm.autoIncPkTable(
  "risk_register",
  {
    risk_register_id: autoIncPK(),
    description: text(),
    risk_subject_id: riskSubject.references.code(),
    risk_type_id: riskType.references.code(),
    impact_to_the_organization: text(),
    rating_likelihood_id: ratingValue.references.code(),
    rating_impact_id: ratingValue.references.code(),
    rating_overall_risk_id: ratingValue.references.code(),
    control_effectivenes_controls_in_place: text(),
    control_effectivenes_control_effectiveness: integer(),
    control_effectivenes_over_all_residual_risk_rating_id: ratingValue
      .references.code(),
    mitigation_further_actions: text(),
    control_monitor_mitigation_actions_tracking_strategy: text(),
    control_monitor_action_due_date: dateNullable(),
    control_monitor_risk_owner_id: person.references.person_id(),
    ...gm.housekeeping.columns,
  },
);

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

const incident = gm.autoIncPkTable(
  "incident",
  {
    incident_id: autoIncPK(),
    title: text(),
    incident_date: date(),
    time_and_time_zone: dateTime(),
    asset_id: asset.references.asset_id(),
    category_id: incidentCategory.references.code(),
    sub_category_id: incidentSubCategory.references.code(),
    severity_id: severity.references.code(),
    priority_id: priority.references.code(),
    internal_or_external_id: incidentType.references.code(),
    location: text(),
    it_service_impacted: text(),
    impacted_modules: text(),
    impacted_dept: text(),
    reported_by_id: person.references.person_id(),
    reported_to_id: person.references.person_id(),
    brief_description: text(),
    detailed_description: text(),
    assigned_to_id: person.references.person_id(),
    assigned_date: dateNullable(),
    investigation_details: text(),
    containment_details: text(),
    eradication_details: text(),
    business_impact: text(),
    lessons_learned: text(),
    status_id: incidentStatus.references.code(),
    closed_date: dateNullable(),
    reopened_time: dateTimeNullable(),
    feedback_from_business: text(),
    reported_to_regulatory: text(),
    report_date: dateNullable(),
    report_time: dateTimeNullable(),
    ...gm.housekeeping.columns,
  },
);

const incidentRootCause = gm.autoIncPkTable(
  "incident_root_cause",
  {
    incident_root_cause_id: autoIncPK(),
    incident_id: incident.references.incident_id(),
    source: text(),
    description: text(),
    probability_id: priority.references.code(),
    testing_analysis: text(),
    solution: text(),
    likelihood_of_risk_id: priority.references.code(),
    modification_of_the_reported_issue: text(),
    testing_for_modified_issue: text(),
    test_results: text(),
    ...gm.housekeeping.columns,
  },
);

const raciMatrixAssignment = gm.autoIncPkTable(
  "raci_matrix_assignment",
  {
    raci_matrix_assignment_id: autoIncPK(),
    person_id: person.references.person_id(),
    subject_id: raciMatrixSubject.references.code(),
    activity_id: raciMatrixActivity.references.raci_matrix_activity_id(),
    raci_matrix_assignment_nature_id: raciMatrixAssignmentNature
      .references.code(),
    ...gm.housekeeping.columns,
  },
);

const personSkill = gm.autoIncPkTable(
  "person_skill",
  {
    person_skill_id: autoIncPK(),
    person_id: person.references.person_id(),
    skill_nature_id: skillNature.references.code(),
    skill_id: skill.references.code(),
    proficiency_scale_id: proficiencyScale.references.code(),
    ...gm.housekeeping.columns,
  },
);

const keyPerformance = gm.autoIncPkTable(
  "key_performance",
  {
    key_performance_id: autoIncPK(),
    title: text(),
    description: text(),
    ...gm.housekeeping.columns,
  },
);

const keyPerformanceIndicator = gm.autoIncPkTable(
  "key_performance_indicator",
  {
    key_performance_indicator_id: autoIncPK(),
    key_performance_id: keyPerformance.references.key_performance_id(),
    asset_id: asset.references.asset_id(),
    calendar_period_id: calendarPeriod.references.code(),
    kpi_comparison_operator_id: comparisonOperator.references.code(),
    kpi_context: text(),
    kpi_lower_threshold_critical: text(),
    kpi_lower_threshold_major: text(),
    kpi_lower_threshold_minor: text(),
    kpi_lower_threshold_ok: text(),
    kpi_lower_threshold_warning: text(),
    kpi_measurement_type_id: kpiMeasurementType.references.code(),
    kpi_status_id: kpiStatus.references.code(),
    kpi_threshold_critical: text(),
    kpi_threshold_major: text(),
    kpi_threshold_minor: text(),
    kpi_threshold_ok: text(),
    kpi_threshold_warning: text(),
    kpi_unit_of_measure: text(),
    kpi_value: text(),
    score: text(),
    tracking_period_id: trackingPeriod.references.code(),
    trend_id: trend.references.code(),
    ...gm.housekeeping.columns,
  },
);

const keyRisk = gm.autoIncPkTable(
  "key_risk",
  {
    key_risk_id: autoIncPK(),
    title: text(),
    description: text(),
    base_value: textNullable(),
    ...gm.housekeeping.columns,
  },
);

const keyRiskIndicator = gm.autoIncPkTable(
  "key_risk_indicator",
  {
    key_risk_indicator_id: autoIncPK(),
    key_risk_id: keyRisk.references.key_risk_id(),
    entry_date: date(),
    entry_value: textNullable(),
    ...gm.housekeeping.columns,
  },
);

const assertion = gm.autoIncPkTable(
  "assertion",
  {
    assertion_id: autoIncPK(),
    foreign_integration: text(),
    assertion: text(),
    assertion_explain: text(),
    assertion_expires_on: dateNullable(),
    assertion_expires_poam: text(),
    ...gm.housekeeping.columns,
  },
);

const attestation = gm.autoIncPkTable(
  "attestation",
  {
    attestation_id: autoIncPK(),
    assertion_id: assertion.references.assertion_id(),
    person_id: person.references.person_id(),
    attestation: text(),
    attestation_explain: text(),
    attested_on: date(),
    expires_on: dateNullable(),
    boundary_id: boundary.references.boundary_id(),
    ...gm.housekeeping.columns,
  },
);

const attestationEvidence = gm.autoIncPkTable(
  "attestation_evidence",
  {
    attestation_evidence_id: autoIncPK(),
    attestation_id: attestation.references.attestation_id(),
    evidence_nature: text(),
    evidence_summary_markdown: text(),
    url: text(),
    content: text(),
    attachment: text(),
    ...gm.housekeeping.columns,
  },
);

function sqlDDL() {
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
    ${boundary}
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
    ${vulnerabilitySource}
    ${severity}
    ${vulnerability}
    ${threatSource}
    ${threatEvent}
    ${assetRiskType}
    ${assetRisk}
    ${priority}
    ${securityImpactAnalysis}
    ${impactOfRisk}
    ${proposedControls}
    ${billing}
    ${scheduledTask}
    ${timesheet}
    ${certificate}
    ${device}
    ${securityIncidentResponseTeam}
    ${rating}
    ${notes}
    ${auditAssertion}
    ${loadAverage}
    ${diskUsage}
    ${networkInterface}
    ${operatingSystem}
    ${cpu}
    ${memory}
    ${systemInfoMode}
    ${systemInfo}
    ${contract}
    ${riskSubject}
    ${riskType}
    ${riskRegister}
    ${incidentCategory}
    ${incidentSubCategory}
    ${incidentType}
    ${incidentStatus}
    ${incident}
    ${incidentRootCause}
    ${raciMatrixAssignment}
    ${personSkill}
    ${keyPerformance}
    ${keyPerformanceIndicator}
    ${keyRisk}
    ${keyRiskIndicator}
    ${assertion}
    ${attestation}
    ${attestationEvidence}

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
    ${threatEventType.seedDML}
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
    ${graphNature.seedDML}
    ${severity.seedDML}
    ${assetRiskType.seedDML}
    ${priority.seedDML}
    ${riskSubject.seedDML}
    ${riskType.seedDML}
    ${incidentCategory.seedDML}
    ${incidentSubCategory.seedDML}
    ${incidentType.seedDML}
    ${incidentStatus.seedDML}
    `;
}
if (import.meta.main) {
  mod.typicalCLI({
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
