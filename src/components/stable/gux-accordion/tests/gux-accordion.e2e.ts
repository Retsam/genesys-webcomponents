import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { axeConfig } from '../../../../../tests/axeConfig';
declare const axe: any;

describe('gux-accordion', () => {
  let page: E2EPage;
  let element: E2EElement;
  beforeEach(async () => {
    page = await newE2EPage();
  });
  it('renders', async () => {
    await page.setContent(`
    <gux-accordion></gux-accordion>
    `);
    element = await page.find('gux-accordion');
    expect(element).toHaveClass('hydrated');
  });
  it('sets sections', async () => {
    const slots = ['First', 'Second', 'Third'];
    await page.setContent(`
    <gux-accordion>
      <div slot="${slots[0]}">
        <span>I'm a span in a div.</span>
        <button>I'm the button.</button>
      </div>
      <p slot="${slots[1]}">I'm a p.</p>
      <span slot="${slots[2]}">I'm a span.</span>
      <h1>I'm an h1, but i'm not a slot.</h1>
    </gux-accordion>
    `);
    element = await page.find('gux-accordion');
    const sections = await element.findAll('gux-accordion section');
    expect(sections.length).toEqual(slots.length);
  });
  it('opens, closes section', async () => {
    await page.setContent(`
    <gux-accordion>
      <div slot="First">
        <span>I'm a span in a div.</span>
        <button>I'm the button.</button>
      </div>
    </gux-accordion>
    `);
    element = await page.find('gux-accordion');
    const section = await element.find('.gux-section');
    const header = await section.find('.gux-header');
    expect(section.className).toEqual('gux-section');
    await header.click();
    await page.waitForChanges();
    expect(section.className).toEqual('gux-section gux-opened');
    await header.click();
    await page.waitForChanges();
    expect(section.className).toEqual('gux-section');
  });
  describe('accessibility', () => {
    it('passes axe-core automated tests', async () => {
      const slots = ['First', 'Second', 'Third'];
      await page.setContent(`
        <gux-accordion>
          <div slot="${slots[0]}">
            <span>I'm a span in a div.</span>
            <button>I'm the button.</button>
          </div>
          <p slot="${slots[1]}">I'm a p.</p>
          <span slot="${slots[2]}">I'm a span.</span>
          <h1>I'm an h1, but i'm not a slot.</h1>
        </gux-accordion>
        `);

      await page.addScriptTag({
        path: 'node_modules/axe-core/axe.min.js'
      });

      const axeResults = await page.evaluate(async axeConfig => {
        const target = document.querySelector('gux-accordion');
        return await axe.run(target, axeConfig);
      });
      const expectedViolations = 0;
      expect(axeResults.violations).toHaveLength(expectedViolations);
    });
  });
});
