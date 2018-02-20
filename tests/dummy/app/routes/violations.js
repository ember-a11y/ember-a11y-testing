import Route from '@ember/routing/route';
import { set } from '@ember/object';


export default Route.extend({
  model() {
    return {
      currentNoiseLevel: 1,
      currentFruit: 'Strawberrries'
    };
  },

  actions: {
    updateCurrentNoiseLevel(level) {
      /**
       * This is a bit hacky, but for the purposes of the demo, we can remove
       * the exisiting classes set so that axe will perfom its check without our styles
       * having influenced the results
       */
      document.querySelectorAll('[class*="axe-violation--"]').forEach(elem => {
        elem.classList.remove(...[elem.className.match(/axe-violation--[^\s]*/g)]);
      });

      set(this.currentModel, 'currentNoiseLevel', level);
    }
  }
});
