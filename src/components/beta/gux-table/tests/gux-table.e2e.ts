import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
declare const axe: any;

describe('gux-table-beta', () => {
  let page: E2EPage;
  let element: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it('renders', async () => {
    await page.setContent(`
      <gux-table-beta lang="en">
        <table slot="data">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
            </tr>
          </tbody>
        </table>
      </gux-table-beta>
    `);
    element = await page.find('gux-table-beta');

    expect(element).toHaveClass('hydrated');
  });

  it('is accessible', async () => {
    await page.setContent(`
      <gux-table-beta lang="en">
        <table slot="data">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
            </tr>
          </tbody>
        </table>
      </gux-table-beta>
    `);

    await page.addScriptTag({
      path: 'node_modules/axe-core/axe.min.js'
    });
    const axeResults = await page.evaluate(async () => {
      const options = {
        runOnly: {
          type: 'tags',
          values: ['wcag2a', 'wcag2aa']
        }
      };
      const target = document.querySelector('gux-table-beta');
      return await axe.run(target, options);
    });

    expect(axeResults.violations).toHaveLength(0);
  });
});
