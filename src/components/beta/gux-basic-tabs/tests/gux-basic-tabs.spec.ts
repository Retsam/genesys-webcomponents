import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { GuxBasicTabs } from '../gux-basic-tabs';
import { GuxBasicTab } from '../gux-basic-tab/gux-basic-tab';

const components = [GuxBasicTabs, GuxBasicTab];
const language = 'en';

describe('gux-basic-tabs', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components,
      html: `
        <gux-basic-tabs id="interactive">
          <span slot="tabs">
            <gux-tab tab-id="1">
              <span slot="title"> Hello World </span>
            </gux-tab>

            <gux-tab tab-id="2">
              <span slot="title"> Hello World 2 </span>
            </gux-tab>
          </span>
        </gux-basic-tabs>
      `,
      language
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxBasicTabs);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
