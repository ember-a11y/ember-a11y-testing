import RouteTemplate from 'ember-route-template';

export default RouteTemplate(
  <template>
    <div class="application o-content-box">

      <div class="application__header">
        <h1 class="u-align-center">
          Ember A11y Testing
        </h1>
      </div>

      <div class="u-relative u-fill-width o-content-box--lg">

        {{outlet}}

      </div>
    </div>
  </template>,
);
