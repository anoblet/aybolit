import '@vaadin/vaadin-dialog';
import { customElement, html, LitElement, property, query } from 'lit-element';

/**
 * Do we want to let an unsubscribed user read the same article an unlimited amount of times?
 * Do we want to remove content from the DOM?
 */

@customElement('cxl-paywall')
export class CXLPaywallElement extends LitElement {
  @property({ type: Number }) _count = 0;
  @property({ type: Number }) _limit = 10;
  @property({ type: Boolean }) _shouldSubscribe = false;

  @property({ type: Number }) delay = 1000;
  @property({ type: Number }) duration = 1000;
  @property({ type: Number }) opacity = 0;
  @property({ type: Boolean }) subscribed = false;

  @query('#content') content;

  _animation;
  _hidden = false;

  render() {
    return html`
      <div id="content">
        <slot></slot>
      </div>
      <vaadin-dialog no-close-on-esc no-close-on-outside-click ?opened=${this._shouldSubscribe}>
        <template> You have reached you're limit of free playbooks, please sign-up here. </template>
      </vaadin-dialog>
    `;
  }

  constructor() {
    super();

    // Add paywall class
    this.classList.add('paywall');

    // Read count from local storage
    this._read();
  }

  updated() {
    this.validate();
  }

  firstUpdated() {
    this._increment();
    this._write();
  }

  /**
   * Hide the content
   */

  _hide() {
    if (this._hidden) return;
    this._animation?.cancel();
    this._animation = this.content.animate(
      [
        {
          opacity: this.opacity,
        },
      ],
      {
        duration: 1000,
        fill: 'forwards',
      }
    );
    this._animation.onfinish = () => {
      this._hidden = true;
      this._shouldSubscribe = true;
    };
    this._animation.play();
  }

  /**
   * Increment the count
   */

  _increment() {
    this._count = this._count + 1;
  }

  /**
   * Read the count from local storage
   */

  _read() {
    const count = localStorage.getItem('cxl-paywall-count');
    if (count !== undefined) this._count = Number(count);
  }

  /**
   * Show content (Only needed for Storybook demo)
   */

  _show() {
    if (!this._hidden) return;
    this._animation?.cancel();
    this._animation = this.content.animate(
      [
        {
          opacity: 100,
        },
      ],
      {
        duration: 1000,
        fill: 'forwards',
      }
    );
    this._animation.onfinish = () => {
      this._hidden = false;
      this._shouldSubscribe = false;
    };
    this._animation.play();
  }

  /**
   * Check if content should be displayed or not
   */

  validate() {
    if (!this.subscribed) {
      if (this._count >= this._limit) {
        setTimeout(() => {
          this._hide();
        }, this.delay);
      } else {
        this._show();
      }
    } else {
      this._show();
    }
  }

  /**
   * Write the count to local storage
   */

  _write() {
    localStorage.setItem('cxl-paywall-count', String(this._count));
  }
}
