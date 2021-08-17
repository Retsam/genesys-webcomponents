import { newE2EPage } from '@stencil/core/testing';
import { axeConfig } from '../../../../../tests/axeConfig';
declare const axe: any;

describe('gux-datepicker', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-datepicker lang="en"></gux-datepicker>');
    const element = await page.find('gux-datepicker');
    expect(element).toHaveClass('hydrated');
  });

  it('updates the text input state when the datepicker’s value property is set', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-datepicker lang="en"></gux-datepicker>');
    const element = await page.find('gux-datepicker');

    await element.setProperty('value', '1985-12-01');
    await page.waitForChanges();

    const input = await page.find('gux-text-field-legacy input');
    const value = await input.getProperty('value');
    expect(value).toBe('12/01/1985');
  });

  describe('accessibility', () => {
    it('passes axe-core automated tests', async () => {
      const page = await newE2EPage({
        html: '<gux-datepicker lang="en"></gux-datepicker>'
      });

      await page.addScriptTag({
        path: 'node_modules/axe-core/axe.min.js'
      });

      const axeResults = await page.evaluate(async axeConfig => {
        const target = document.querySelector('gux-datepicker');
        return await axe.run(target, axeConfig);
      });
      const expectedViolations = 0;
      expect(axeResults.violations).toHaveLength(expectedViolations);
    });
  });
});
