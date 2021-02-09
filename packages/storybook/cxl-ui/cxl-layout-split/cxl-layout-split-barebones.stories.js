import '@conversionxl/cxl-ui/src/components/cxl-layout-split';
import { withKnobs, select } from '@storybook/addon-knobs';
import { html } from 'lit-html';

export default {
  decorators: [withKnobs],
  title: 'CXL UI/Layout',
};

export const Barebones = () => html`
  <cxl-layout-split position=${select('Position', { '': '', Left: 'left', Right: 'right' }, '')}>
    <aside slot="aside">Navigation</aside>
    Content
  </cxl-layout-split>
`;
