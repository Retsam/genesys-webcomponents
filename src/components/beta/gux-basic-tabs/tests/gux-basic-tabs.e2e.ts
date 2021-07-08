import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-basic-tabs', () => {
  it('renders', async () => {
    const html = `
      <gux-basic-tabs id="interactive" lang="en">
        <span slot="tabs">
          <gux-basic-tab tab-id="1" tab-icon-name="lock">
            <span slot="title"> Hello World </span>
          </gux-tab>

          <gux-tab tab-id="2" tab-icon-name="lock">
            <span slot="title"> Hello World 2 </span>
          </gux-tab>
        </span>
      </gux-tabs>
    `;
    const page = await newE2EPage({ html });
    const element = await page.find('gux-basic-tabs');

    expect(element.innerHTML).toMatchSnapshot();
  });
});
