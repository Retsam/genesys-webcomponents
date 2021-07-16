import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

@Component({
  tag: 'gux-title-tooltip'
})
export class GuxBasicTab {
  private titleName: string;

  @Element()
  private root: HTMLElement;

  @Prop()
  tooltip: string = '';

  @State() private showTooltip: boolean = true;

  componentWillLoad() {
    if (this.tooltip) {
      this.titleName = this.tooltip;
    } else if (this.root.querySelector('[slot="title"]')) {
      this.titleName = this.root.querySelector('[slot="title"]').innerHTML;
      this.checkForTooltipHideOrShow();
    }
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    // console.log(clientWidth, 'clientWidth')
    if (clientWidth < 113) {
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
