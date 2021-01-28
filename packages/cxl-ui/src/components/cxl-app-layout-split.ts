import { customElement, html, LitElement, property } from 'lit-element';
import cxlAppLayoutStyles from '../styles/cxl-app-layout-css.js';
import '@vaadin/vaadin-split-layout';
import { nothing } from 'lit-html';

@customElement('cxl-app-layout-split')
export class CXLAppLayoutSplitElement extends LitElement {
  @property({ type: String }) position: 'left' | 'right';
  @property({ type: Boolean }) wide: boolean;

  static get styles() {
    return [cxlAppLayoutStyles];
  }

  // static get properties() {
  //   return {
  //     position: { type: String },
  //     wide: { type: Boolean }
  //   };
  // }

  render() {
    return html`
      Test
      ${!this.position
        ? html`
            <div><slot></slot></div>
          `
        : html`
            <vaadin-split-layout orientation=${this.wide ? 'horizontal' : 'vertical'}>
              ${!this.wide || this.position === 'left'
                ? html`
                    <div><slot name="aside"></slot></div>
                  `
                : nothing}
              <div><slot></slot></div>
              ${this.wide && this.position === 'right'
                ? html`
                    <div><slot name="aside"></slot></div>
                  `
                : nothing}
            </vaadin-split-layout>
          `}
    `;
  }

  firstUpdated() {
    observe('(min-width: 512px)', (wide: boolean) => (this.wide = wide));
  }
}

const observe = (mediaQueryString: string, callback: (matches: boolean) => void) => {
  const observer = window.matchMedia(mediaQueryString);
  const matches = mediaQueryList => callback(mediaQueryList.matches);
  matches(observer);
  observer.addEventListener('change', matches);
};
