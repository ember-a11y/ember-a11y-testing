type Hook = (...args: any[]) => void | Promise<void>;

interface BaseContext {
  [key: string]: any;
}

interface ITestMetadata {
  testName?: string;
  setupTypes: string[];
  usedHelpers: string[];
  [key: string]: any;

  readonly isRendering: boolean;
  readonly isApplication: boolean;
}

declare module '@ember/test-helpers' {
  export type HookUnregister = {
    unregister: () => void;
  };

  export function _registerHook(
    helperName: string,
    label: string,
    hook: Hook
  ): HookUnregister;

  export function _runHooks(
    helperName: string,
    label: string,
    ...args: any[]
  ): Promise<void>;

  export function getTestMetadata(context: BaseContext): ITestMetadata;
}
