import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-basic-tab', () => {
  let page: E2EPage;
  let element: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it('renders', async () => {
    await page.setContent(`
    <gux-basic-tab>
      <span slot="title">Hello</span>
    </gux-basic-tab>
    `);
    element = await page.find('gux-basic-tab');
    expect(element).toHaveClass('hydrated');
  });
});
