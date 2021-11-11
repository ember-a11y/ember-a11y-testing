import { AxeResults } from 'axe-core';

export interface InvocationStrategy {
  (helperName: string, label: string): boolean;
}

export interface A11yAuditReporter {
  (axeResults: AxeResults): Promise<void>;
}

export interface AuditFunction {
  (...args: any[]): PromiseLike<void>;
}
