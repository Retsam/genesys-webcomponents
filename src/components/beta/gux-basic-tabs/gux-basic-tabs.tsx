import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import {
  GuxBasicTabsOrientation,
  GuxBasicTabsAlignment
} from './gux-basic-tabs.types';

@Component({
  styleUrl: 'gux-basic-tabs.less',
  tag: 'gux-basic-tabs-beta',
  shadow: true
})
export class GuxTabsBeta {
  @Element()
  root: HTMLElement;

  @Prop({ mutable: true })
  activePanelId: string;

  @Prop()
  orientation: GuxBasicTabsOrientation = 'horizontal';

  @Prop()
  alignment: GuxBasicTabsAlignment = 'left';

  @State()
  tabList: HTMLGuxBasicTabListElement;

  @State()
  tabPanels: HTMLGuxBasicTabPanelElement[] = [];

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

    this.tabList =
      tabListSlot.assignedElements()[0] as HTMLGuxBasicTabListElement;
    this.tabPanels =
      defaultSlot.assignedElements() as HTMLGuxBasicTabPanelElement[];

    this.activateTab(this.activePanelId, this.tabList, this.tabPanels);
  }

  private activateTab(
    panelId: string,
    tabList: HTMLGuxBasicTabListElement,
    panels: HTMLGuxBasicTabPanelElement[]
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
      <Host>
        <div
          class={`gux-basic-tabs gux-${this.alignment} gux-${this.orientation}`}
        >
          <slot name="tab-list"></slot>
          <div class={`gux-${this.alignment} gux-${this.orientation}`}>
            <slot onSlotchange={this.onSlotchange.bind(this)}></slot>
          </div>
        </div>
      </Host>
    );
  }
}
