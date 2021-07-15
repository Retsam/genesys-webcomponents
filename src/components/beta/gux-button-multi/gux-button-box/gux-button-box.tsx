import { Component, Element, h, Host, JSX } from '@stencil/core';

/**
 * @slot - collection of gux-buttons
 */
@Component({
  styleUrl: 'gux-button-box.less',
  tag: 'gux-button-box',
  shadow: true
})
export class GuxButtonBox {
  @Element()
  root: HTMLElement;

  render(): JSX.Element {
    return (
      <Host role="listbox" tabIndex={0}>
        <slot />
      </Host>
    );
  }
}
