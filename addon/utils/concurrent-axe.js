import { next } from '@ember/runloop';

export class ConcurrentAxe {
  constructor() {
    this._timer = null;
    this._queue = [];
  }

  /**
   * Axe v3 contains a concurrency issue which breaks the component auditing feature.
   * This service defers axe.run calls on onto the next loop so that concurrent
   * axe executions do not occur.
   *
   * @see(https://github.com/dequelabs/axe-core/issues/1041)
   * @public
   * @param {HTMLElement} element axe context
   * @param {Object} options axe configuration options
   * @param {Function} callback axe audit callback
   * @return {Void}
   */
  run(element, options, callback) {
    if (this._timer !== null) {
      this._queue.push(arguments);
    } else {
      this._timer = next(() => {
        if (element && element.parentNode) {
          axe.run(element, options, callback);
        }

        this._timer = null;

        if (this._queue.length) {
          this.run(...this._queue.shift());
        }
      });
    }
  }
}

export default new ConcurrentAxe();
