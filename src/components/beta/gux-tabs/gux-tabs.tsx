import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

@Component({
  styleUrl: 'gux-tabs.less',
  tag: 'gux-tabs-beta',
  shadow: true
})
export class GuxTabsBeta {
  @Element()
  root: HTMLElement;

  @Prop({ mutable: true })
  activePanelId: string;

  @State()
  tabList: HTMLGuxTabListElement;

  @State()
  tabPanels: HTMLGuxTabPanelElement[] = [];

  @Event()
  guxactivepanelidchange: EventEmitter<string>;

  @Watch('activePanelId')
  watchActivePanelId(newValue: string) {
    this.guxactivepanelidchange.emit(newValue);
  }

  @Listen('internalactivatetabpanel')
  onInternalActivateTabPanel(event: CustomEvent): void {
    event.stopPropagation();

    this.activateTab(event.detail, this.tabList, this.tabPanels);
  }

  @Method()
  async guxActivate(panelId: string): Promise<void> {
    this.activateTab(panelId, this.tabList, this.tabPanels);
  }

  private onSlotchange(): void {
    const [tabListSlot, defaultSlot] = Array.from(
      this.root.shadowRoot.querySelectorAll('slot')
    );

    this.tabList = tabListSlot.assignedElements()[0] as HTMLGuxTabListElement;
    this.tabPanels = defaultSlot.assignedElements() as HTMLGuxTabPanelElement[];

    this.activateTab(this.activePanelId, this.tabList, this.tabPanels);
  }

  private activateTab(
    panelId: string,
    tabList: HTMLGuxTabListElement,
    panels: HTMLGuxTabPanelElement[]
  ): void {
    if (panelId) {
      this.activePanelId = panelId;
    } else {
      this.activePanelId = panels[0].panelId;
    }

    tabList.guxSetActive(this.activePanelId);
    panels.forEach(panel =>
      panel.guxSetActive(panel.panelId === this.activePanelId)
    );
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <div>
        <slot name="tab-list"></slot>
        <div>
          <slot onSlotchange={this.onSlotchange.bind(this)}></slot>
        </div>
      </div>
    );
  }
}
