import type { Services } from "./contracts";
import { mockServices } from "./mock";

/**
 * Single switch-point for data access. Replace `mockServices` with an
 * API-backed implementation of `Services` when the backend is ready.
 */
export const services: Services = mockServices;

export type { Services } from "./contracts";
export { ServiceError, errorMessage } from "./errors";
