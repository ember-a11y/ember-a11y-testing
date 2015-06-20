import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggle() {
      this.set('isFailing', true);
    }
  }
});
