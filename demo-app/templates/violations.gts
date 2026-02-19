import image from '../assets/img/empire-state-building-moonlight.png';

import type { TOC } from '@ember/component/template-only';

const XParagraph = <template>
  <p class="c-paragraph" ...attributes>
    {{yield}}
  </p>
</template> satisfies TOC<{
  Element: HTMLParagraphElement;
  Blocks: {
    default: [];
  };
}>;

const ViolationsGridItem = <template>
  <li class="c-violations-grid-item o-content-box" ...attributes>
    <section class="c-violations-grid-item__header">
      <h3 class="c-violations-grid-item__title u-align-center">{{@title}}</h3>
    </section>

    <section class="c-violations-grid-item__body u-relative">
      <div class="c-violations-grid-item__body-content u-fill">
        {{! Provide violating content here }}
        {{yield}}
      </div>
    </section>
  </li>
</template> satisfies TOC<{
  Element: HTMLLIElement;
  Args: {
    title: string;
  };
  Blocks: {
    default: [];
  };
}>;

import RouteTemplate from 'ember-route-template';

export default RouteTemplate(
  <template>
    <header class="p-violations__header">
      <h2 data-test-selector="violations-page__passing-component">
        Violations
      </h2>
    </header>

    <section class="p-violations__body u-fill-width u-relative">
      <ul class="p-violations__grid u-fill-width u-relative">

        {{! Empty button }}
        <ViolationsGridItem
          class="p-violations__grid-item"
          @title="Button without title"
        >
          <button
            type="button"
            class="c-button"
            id="violations__empty-button"
            data-test-selector="empty-button"
          ></button>
        </ViolationsGridItem>

        {{! Labelless text input }}
        <ViolationsGridItem
          class="p-violations__grid-item"
          @title="Input without label"
        >
          <input
            type="text"
            class="c-text-input__input"
            id="violations__labeless-input"
            data-test-selector="labeless-text-input"
          />
        </ViolationsGridItem>

        {{! Poorly Contrasting Text color }}
        <ViolationsGridItem
          class="p-violations__grid-item"
          @title="Poorly Contrasting Text Color"
        >
          <XParagraph
            class="p-violations__grid-item-content--low-contrast-text"
            data-test-selector="poor-text-contrast"
            id="violations__low-contrast-text"
          >
            Swoooosh
          </XParagraph>
        </ViolationsGridItem>

        {{! Usage of the <blink> element }}
        <ViolationsGridItem
          class="p-violations__grid-item"
          @title="Non-standard HTML elements"
        >
          <XParagraph
            id="violations__non-standard-html"
            data-test-selector="paragraph-with-blink-tag"
          >
            {{! template-lint-disable no-obsolete-elements }}
            Friends don't let friends use
            <code>&lt;blink&gt; tags</code>,
            <blink>like this one!</blink>
          </XParagraph>
        </ViolationsGridItem>

        {{! <img> tags without alt text }}
        <ViolationsGridItem
          class="p-violations__grid-item"
          @title="<img> Tags without alt attributes"
        >
          {{! template-lint-disable require-valid-alt-text }}
          <img
            class="c-img u-fill"
            id="violations__img-without-alt"
            src={{image}}
          />
        </ViolationsGridItem>

      </ul>
    </section>

    <footer class="p-violations__footer">
      For more on
      <strong>accessible</strong>
      user interface patterns, check out
      <a href="https://ember-a11y.github.io/a11y-demo-app/">
        Ember A11y's best-practices demo app
      </a>.
    </footer>
  </template>,
);
