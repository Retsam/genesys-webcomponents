import {
  Component,
  Element,
  h,
  Listen,
  JSX,
  Prop,
  State,
  Watch
} from '@stencil/core';
import { ClickOutside } from 'stencil-click-outside';

import { whenEventIsFrom } from '../../../utils/dom/when-event-is-from';

import { trackComponent } from '../../../usage-tracking';

/**
 * @slot label - for label element
 * @slot button-box - for gux-button-box element
 */
@Component({
  styleUrl: 'gux-button-multi.less',
  tag: 'gux-button-multi-beta',
  shadow: true
})
export class GuxButtonMulti {
  private fieldButtonElement: HTMLElement;
  private buttonBoxElement: HTMLGuxButtonBoxElement;

  @Element()
  private root: HTMLElement;

  @Prop()
  disabled: boolean = false;

  @State()
  private expanded: boolean = false;

  @Watch('expanded')
  focusSelectedItemAfterRender(expanded: boolean) {
    if (expanded && this.buttonBoxElement) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.buttonBoxElement.focus();
        });
      });
    }
  }

  @Listen('click')
  onClick(event: MouseEvent): void {
    whenEventIsFrom('gux-button', event, () => {
      this.collapseButtonBox('noFocusChange');
    });
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.collapseButtonBox('focusFieldButton');
        return;
      case 'Tab':
        this.collapseButtonBox('noFocusChange');
        return;
    }
  }

  @ClickOutside({ triggerEvents: 'mousedown' })
  checkForClickOutside() {
    this.collapseButtonBox('noFocusChange');
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);

    this.buttonBoxElement = this.root.querySelector('gux-button-box');
  }

  private renderTarget(): JSX.Element {
    return (
      <button
        slot="target"
        type="button"
        class="gux-field-button"
        disabled={this.disabled}
        onClick={this.fieldButtonClick.bind(this)}
        ref={el => (this.fieldButtonElement = el)}
        aria-haspopup="listbox"
        aria-expanded={this.expanded.toString()}
      >
        <div>
          <slot name="label"></slot>
        </div>
        <gux-icon
          class="gux-expand-icon"
          decorative
          iconName="chevron-small-down"
        ></gux-icon>
      </button>
    );
  }

  private fieldButtonClick(): void {
    this.expanded = !this.expanded;
  }

  private collapseButtonBox(
    focusChange: 'noFocusChange' | 'focusFieldButton'
  ): void {
    if (this.expanded) {
      this.expanded = false;
    }

    if (focusChange === 'focusFieldButton') {
      this.fieldButtonElement.focus();
    }
  }

  private renderPopup(): JSX.Element {
    return (
      <div slot="popup" class="gux-button-box-container">
        <gux-button-box>
          <slot></slot>
        </gux-button-box>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <gux-popup-beta expanded={this.expanded} disabled={this.disabled}>
        {this.renderTarget()}
        {this.renderPopup()}
      </gux-popup-beta>
    );
  }
}
