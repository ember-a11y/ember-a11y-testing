export interface InvocationStrategy {
  (helperName: string, label: string): boolean;
}

/**
 * Invocation strategy implementation to run audits all tests.
 */
export const invokeAll: InvocationStrategy = function invokeAll(): boolean {
  return true;
};
