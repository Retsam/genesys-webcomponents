import { Component, Element, h, JSX, Prop, State } from '@stencil/core';
import { logError } from '../../../utils/error/log-error';

@Component({
  tag: 'gux-tooltip-title'
})
export class GuxTooltipTitle {
  private titleName: string;

  @Element()
  private root: HTMLElement;

  @Prop()
  tooltip: string = '';

  @Prop()
  tabWidth: number;

  @State() private showTooltip: boolean = true;

  componentWillLoad() {
    if (this.tooltip) {
      this.titleName = this.tooltip;
    } else if (this.root.querySelector('[slot="title"]')) {
      this.titleName = this.root.querySelector('[slot="title"]').innerHTML;
      this.checkForTooltipHideOrShow();
    } else {
      logError(
        'gux-tooltip-title',
        'No text provided. Please provide a tooltip attribute with localized text to describe the component.'
      );
    }
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    if (this.tabWidth && clientWidth < this.tabWidth) {
      this.showTooltip = false;
    }
  }

  render(): JSX.Element {
    return [<slot name="icon" />, <slot name="title" />, this.renderTooltip()];
  }

  private renderTooltip() {
    if (this.showTooltip) {
      return <gux-tooltip>{this.titleName}</gux-tooltip>;
    }
  }
}
