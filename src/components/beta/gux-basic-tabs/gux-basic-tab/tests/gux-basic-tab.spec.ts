import { newSpecPage } from '@stencil/core/testing';
import { GuxBasicTab } from '../gux-basic-tab';

describe('gux-tab', () => {
  let component: GuxBasicTab;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxBasicTab],
      html: `<gux-basic-tab><span slot="title">Hello</span></gux-basic-tab>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  describe('Class Logic', () => {
    it('should pass', () => {
      expect(true).toBeTruthy();
    });
  });
});
