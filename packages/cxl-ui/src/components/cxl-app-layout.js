/**
 * @todo implement primary action button.
 */
import '@conversionxl/cxl-lumo-styles';
import { registerGlobalStyles } from '@conversionxl/cxl-lumo-styles/src/utils';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-context-menu/src/vaadin-device-detector.js';
import '@vaadin/vaadin-split-layout';
import { customElement, html, LitElement, property, query } from 'lit-element';
import { nothing } from 'lit-html';
import cxlAppLayoutStyles from '../styles/cxl-app-layout-css.js';
import cxlAppLayoutGlobalStyles from '../styles/global/cxl-app-layout-css.js';

const ASIDE_LOCAL_STORAGE_KEY = 'cxl-app-layout-aside-opened';

const observe = (mediaQueryString, callback) => {
  const observer = window.matchMedia(mediaQueryString);
  const matches = (mediaQueryList) => callback(mediaQueryList.matches);
  matches(observer);
  observer.addEventListener('change', matches);
};

@customElement('cxl-app-layout')
export class CXLAppLayoutElement extends LitElement {
  @query('aside')
  asideElement;

  @property({ type: Boolean })
  get asideOpened() {
    this._asideOpened = JSON.parse(localStorage.getItem(ASIDE_LOCAL_STORAGE_KEY));

    return (
      this._asideOpened === null ||
      (this.scroll !== 'panels' && this.layout === '2c-l') ||
      this._asideOpened
    );
  }

  set asideOpened(value) {
    localStorage.setItem(ASIDE_LOCAL_STORAGE_KEY, JSON.stringify(value));

    this.requestUpdate('asideOpened', this._asideOpened);
  }

  /**
   * 2-column layouts can scroll individual content panels, or document.
   *
   * @type {string}
   */
  @property({ reflect: true })
  scroll = 'document';

  /**
   * Configurable layout.
   *
   * @type {string}
   */
  @property()
  layout = '1c';

  // vaadin-device-detector.
  @property({ type: Boolean, reflect: true })
  wide;

  static get styles() {
    return [cxlAppLayoutStyles];
  }

  render() {
    const asideElement = html`
      <aside
        role="complementary"
        aria-label="Primary sidebar"
        itemscope="itemscope"
        itemtype="https://schema.org/WPSideBar"
        ?opened="${this.asideOpened}"
      >
        <vaadin-button
          aria-label="Toggle sidebar"
          theme="contrast icon"
          @click="${() => {
            this.asideOpened = !this.asideOpened;
          }}"
        >
          <iron-icon icon="lumo:angle-right"></iron-icon>
        </vaadin-button>
        <slot name="sidebar"></slot>
      </aside>
    `;

    const mainElement = html`
      <main role="main" itemprop="mainContentOfPage">
        <slot></slot>
      </main>
    `;

    return html`
      <header role="banner" itemscope="itemscope" itemtype="https://schema.org/WPHeader">
        <slot name="header"></slot>
      </header>

      <div id="main">
        ${this.layout === '1c' || this.layout === '1c-c' || this.layout === '1c-w'
          ? html` ${mainElement} `
          : html`
              <vaadin-split-layout orientation=${this.wide ? 'horizontal' : 'vertical'}>
                ${!this.wide || this.layout === '2c-r' ? html` ${asideElement} ` : nothing}
                ${mainElement}
                ${this.wide && this.layout === '2c-l' ? html` ${asideElement} ` : nothing}
              </vaadin-split-layout>
            `}
      </div>

      <footer role="contentinfo" itemscope="itemscope" itemtype="https://schema.org/WPFooter">
        <slot name="footer"></slot>
      </footer>
    `;
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);

    observe('(min-width: 512px)', (wide) => {
      this.wide = wide;
    });

    // Global styles.
    registerGlobalStyles(cxlAppLayoutGlobalStyles, {
      moduleId: 'cxl-app-layout-global',
    });
  }
}
