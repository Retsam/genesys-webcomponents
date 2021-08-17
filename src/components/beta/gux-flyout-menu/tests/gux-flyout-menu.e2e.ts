import { newE2EPage } from '@stencil/core/testing';
import { axeConfig } from '../../../../../tests/axeConfig';
declare const axe: any;

describe('gux-flyout-menu', () => {
  const html = `
    <gux-flyout-menu-beta>
      <span slot="target">Example Target Element</span>
      <gux-menu slot="menu">
        <gux-menu-option>Option One</gux-menu-option>
        <gux-submenu label="Submenu Two">
          <gux-menu-option>Option One</gux-menu-option>
          <gux-submenu label="Submenu Two">
            <gux-menu-option>Option One</gux-menu-option>
            <gux-menu-option>Option Two</gux-menu-option>
            <gux-menu-option>Option Three</gux-menu-option>
          </gux-submenu>
          <gux-menu-option>Option Three</gux-menu-option>
        </gux-submenu>
        <gux-menu-option>Option Three</gux-menu-option>
        <gux-menu-option>Option Four</gux-menu-option>
        <gux-submenu label="Submenu Five">
          <gux-menu-option>Option One</gux-menu-option>
          <gux-menu-option>Option Two</gux-menu-option>
          <gux-submenu label="Submenu Three">
            <gux-menu-option>Option One</gux-menu-option>
            <gux-submenu label="Submenu Two">
              <gux-menu-option>Option One</gux-menu-option>
              <gux-submenu label="Submenu Two">
                <gux-menu-option>Option One</gux-menu-option>
                <gux-menu-option>Option Two</gux-menu-option>
                <gux-menu-option>Option Three</gux-menu-option>
              </gux-submenu>
              <gux-menu-option>Option Three</gux-menu-option>
            </gux-submenu>
            <gux-menu-option>Option Three</gux-menu-option>
          </gux-submenu>
        </gux-submenu>
      </gux-menu>
    </gux-flyout-menu-beta>
  `;

  describe('#render', () => {
    it(`should render as expected`, async () => {
      const page = await newE2EPage({ html });
      const element = await page.find('gux-flyout-menu-beta');

      expect(element.outerHTML).toMatchSnapshot();
    });
  });

  describe('accessibility', () => {
    it('passes axe-core automated tests', async () => {
      const page = await newE2EPage({ html });

      await page.addScriptTag({
        path: 'node_modules/axe-core/axe.min.js'
      });

      const axeResults = await page.evaluate(async axeConfig => {
        const target = document.querySelector('gux-flyout-menu-beta');
        return await axe.run(target, axeConfig);
      });
      const expectedViolations = 0;
      expect(axeResults.violations).toHaveLength(expectedViolations);
    });
  });
});
