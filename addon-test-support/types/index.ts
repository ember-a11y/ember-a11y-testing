export interface InvocationStrategy {
  (helperName: string, label: string): boolean;
}
