/**
 * This is old-style Typescript, TODO switch to Zod instead
 */

export interface TypeGuard<T> {
  (o: unknown): o is T;
}

export function typeGuard<T, K extends keyof T = keyof T>(
  ...requireKeysInSingleT: K[] // = [...keyof T] TODO: default this to all required keys
): TypeGuard<T> {
  return (o: unknown): o is T => {
    // Make sure that the object passed is a real object and has all required props
    if (o && typeof o === "object") {
      return !requireKeysInSingleT.find((p) => !(p in o));
    }
    return false;
  };
}

/**
 * Health Check Response Format for HTTP APIs (draft-inadarei-api-health-check-01)
 * See: https://tools.ietf.org/id/draft-inadarei-api-health-check-06.html
 */

/**
 * Status: (required) indicates whether the service status is acceptable or not. API publishers SHOULD use following values for the field:
 *   “pass”: healthy,
 *   “fail”: unhealthy, and
 *   “warn”: healthy, with some concerns.
 * The value of the status field is tightly related with the HTTP response code returned by the health endpoint. For “pass” and “warn” statuses
 * HTTP response code in the 2xx-3xx range MUST be used. For “fail” status HTTP response code in the 4xx-5xx range MUST be used. In case of the
 * “warn” status, endpoint SHOULD return HTTP status in the 2xx-3xx range and additional information SHOULD be provided, utilizing optional
 * fields of the response.
 */
export type ServiceHealthState = "pass" | "fail" | "warn";
export type ServiceHealthLinks = Record<string, string>;
export type ServiceHealthAffectedEndpoints = Record<string, string>;

export interface ServiceHealthStatusable {
  status: ServiceHealthState;
}

export const isServiceHealthStatus =
  typeGuard<ServiceHealthStatusable>("status");

export interface ServiceHealthDiagnosable {
  output: string;
  notes?: string[];
}

export const isServiceHealthDiagnosable =
  typeGuard<ServiceHealthDiagnosable>("output");

export interface ServiceHealthVersioned {
  version: string;
  releaseId: string;
}

export const isServiceHealthVersioned = typeGuard<ServiceHealthVersioned>(
  "version",
  "releaseId",
);

export interface ServiceHealthComponents {
  checks: Record<ServiceHealthComponentName, ServiceHealthComponentChecks>;
}

export const isServiceHealthComponents =
  typeGuard<ServiceHealthComponents>("checks");

export interface ServiceHealthLinkable {
  links: ServiceHealthLinks;
}

export const isServiceHealthLinkable =
  typeGuard<ServiceHealthLinkable>("links");

export interface ServiceHealthAffectable {
  affectedEndpoints: ServiceHealthAffectedEndpoints;
}

export const isServiceHealthAffectable =
  typeGuard<ServiceHealthAffectable>("affectedEndpoints");

export interface ServiceHealthIdentity {
  serviceId: string;
  description: string;
}

export const isServiceHealthIdentity = typeGuard<ServiceHealthIdentity>(
  "serviceId",
  "description",
);

export interface HealthyServiceStatus
  extends ServiceHealthStatusable,
    ServiceHealthVersioned,
    Partial<ServiceHealthLinkable>,
    Partial<ServiceHealthComponents>,
    Partial<ServiceHealthIdentity> {
  status: "pass";
}

export interface UnhealthyServiceStatus
  extends ServiceHealthStatusable,
    ServiceHealthVersioned,
    ServiceHealthDiagnosable,
    ServiceHealthComponents,
    ServiceHealthIdentity,
    Partial<ServiceHealthLinkable>,
    Partial<ServiceHealthAffectable> {
  status: "fail" | "warn";
}

export type HealthServiceStatus = HealthyServiceStatus | UnhealthyServiceStatus;

export interface HealthServiceStatusEndpoint {
  readonly headers: Record<string, string>;
  readonly body: HealthServiceStatus;
}

export function isHealthy(o: unknown): o is HealthyServiceStatus {
  if (isServiceHealthStatus(o)) {
    if (o.status === "pass") return true;
  }
  return false;
}

export function isUnhealthy(o: unknown): o is UnhealthyServiceStatus {
  if (isServiceHealthStatus(o)) {
    if (o.status !== "pass") return true;
  }
  return false;
}

export type TypicalServiceHealthMetricName =
  | "utilization"
  | "responseTime"
  | "connections"
  | "uptime";

export type ServiceHealthObservedValue =
  | string
  | number
  | Date
  | Record<string, unknown>
  | unknown[];
export type ServiceHealthObservedUnit = string;

export interface ServiceHealthObservation {
  metricName: TypicalServiceHealthMetricName | string;
  observedValue: ServiceHealthObservedValue;
  observedUnit: ServiceHealthObservedUnit;
}

export type ServiceHealthComponentName = string;
export type ServiceHealthComponentType = "component" | "datastore" | "system";

export interface ServiceHealthComponent {
  componentId: string;
  componentType: ServiceHealthComponentType;
}

export interface HealthyServiceHealthComponentStatus
  extends ServiceHealthStatusable,
    ServiceHealthComponent,
    Partial<ServiceHealthObservation>,
    ServiceHealthLinkable {
  time: Date;
  node?: string;
}

export interface UnhealthyServiceHealthComponentStatus
  extends ServiceHealthStatusable,
    ServiceHealthComponent,
    Partial<ServiceHealthObservation>,
    ServiceHealthDiagnosable,
    ServiceHealthLinkable {
  time: Date;
  node?: string;
}

export type ServiceHealthComponentStatus =
  | HealthyServiceHealthComponentStatus
  | UnhealthyServiceHealthComponentStatus;
export type ServiceHealthComponentChecks = ServiceHealthComponentStatus[];

export interface ServiceHealthSupplier {
  readonly serviceHealth: ServiceHealthComponents;
}

export const isServiceHealthSupplier =
  typeGuard<ServiceHealthSupplier>("serviceHealth");

export function defaultLinks(): ServiceHealthLinks {
  return {
    schema: "https://tools.ietf.org/id/draft-inadarei-api-health-check-06.html",
  };
}

export function healthyService(
  report: Omit<HealthyServiceStatus, "status">,
): HealthyServiceStatus {
  const links = defaultLinks();
  return {
    status: "pass",
    ...report,
    links: report.links ? { ...report.links, ...links } : links,
  };
}

export function healthyComponent(
  report: Omit<HealthyServiceHealthComponentStatus, "status">,
): HealthyServiceHealthComponentStatus {
  return {
    status: "pass",
    ...report,
  };
}

export function healthStatusEndpoint(
  report: HealthServiceStatus,
): HealthServiceStatusEndpoint {
  return {
    headers: {
      "Content-Type": "application/health+json",
      "Cache-Control": "max-age=3600",
    },
    body: report,
  };
}

export function unhealthyService(
  status: "fail" | "warn",
  report: Omit<UnhealthyServiceStatus, "status">,
): UnhealthyServiceStatus {
  const links = defaultLinks();
  return {
    status: status,
    ...report,
    links: report.links ? { ...report.links, ...links } : links,
  };
}

export function unhealthyComponent(
  status: "fail" | "warn",
  report: Omit<UnhealthyServiceHealthComponentStatus, "status">,
): UnhealthyServiceHealthComponentStatus {
  return {
    status: status,
    ...report,
  };
}
