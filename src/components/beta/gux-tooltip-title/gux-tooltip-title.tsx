import { Component, Element, h, JSX, Prop, State } from '@stencil/core';
import { logError } from '../../../utils/error/log-error';

@Component({
  styleUrl: 'gux-tooltip-title.less',
  tag: 'gux-tooltip-title'
})
export class GuxTooltipTitle {
  private titleName: string;

  @Element()
  private root: HTMLElement;

  @Prop()
  iconOnly: boolean = false;

  @Prop()
  tabWidth: number;

  @State() private showTooltip: boolean = true;

  componentWillLoad() {
    if (this.root.querySelector('[slot="title"]')) {
      this.titleName = this.root.querySelector('[slot="title"]').innerHTML;
      this.checkForTooltipHideOrShow();
    } else {
      logError(
        'gux-tooltip-title',
        'No text provided. Please provide a title for the component.'
      );
    }
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    if (this.iconOnly) {
      this.showTooltip = true;
      return;
    }
    if (this.tabWidth && clientWidth < this.tabWidth) {
      this.showTooltip = false;
      return;
    }
  }

  render(): JSX.Element {
    return [
      <slot name="icon" />,
      <span class={{ 'gux-hidden': this.iconOnly }}>
        <slot name="title" />
      </span>,
      this.renderTooltip()
    ];
  }

  private renderTooltip() {
    if (this.showTooltip) {
      return <gux-tooltip>{this.titleName}</gux-tooltip>;
    }
  }
}
