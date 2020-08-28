type Hook = (...args: any[]) => void | Promise<void>;

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
}
