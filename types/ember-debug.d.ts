import '@ember/debug';

export type DeprecationStages = 'available' | 'enabled';

declare module '@ember/debug' {
  export function deprecate(
    message: string,
    test: boolean,
    options: {
      /**
       * A unique id for this deprecation. The id can be used by Ember debugging
       * tools to change the behavior (raise, log or silence) for that specific
       * deprecation. The id should be namespaced by dots, e.g.
       * `"view.helper.select"`.
       */
      id: string;
      /**
       * The version of Ember when this deprecation warning will be removed.
       */
      until: string;
      /**
       * A namespace for the deprecation, usually the package name
       */
      for: string;
      /**
       * Describes when the deprecation became available and enabled
       */
      since: Partial<Record<DeprecationStages, string>>;
      /**
       * An optional url to the transition guide on the emberjs.com website.
       */
      url?: string | undefined;
    }
  ): void;
}
