import type { AxeResults, RunOptions } from 'axe-core';

export interface InvocationStrategy {
  (helperName: string, label: string): boolean;
}

export interface A11yAuditReporter {
  (axeResults: AxeResults): Promise<void> | void;
}

export interface AuditFunction {
  (runOptions?: RunOptions): PromiseLike<void> | void;
}
