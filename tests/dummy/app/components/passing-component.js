import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggle() {
      Ember.run.schedule('render', () => this.$('label').css('display', 'none'));
    }
  }
});
