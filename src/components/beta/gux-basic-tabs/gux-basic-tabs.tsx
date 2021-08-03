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
  activeTab: string;

  @Prop()
  orientation: GuxBasicTabsOrientation = 'horizontal';

  @Prop()
  alignment: GuxBasicTabsAlignment = 'left';

  @State()
  tabList: HTMLGuxBasicTabListElement;

  @State()
  tabPanels: HTMLGuxBasicTabPanelElement[] = [];

  @Event()
  guxactivetabchange: EventEmitter<string>;

  @Watch('activeTab')
  watchActiveTab(newValue: string) {
    this.guxactivetabchange.emit(newValue);
  }

  @Listen('internalactivatetabpanel')
  onInternalActivateTabPanel(event: CustomEvent): void {
    event.stopPropagation();

    this.activateTab(event.detail, this.tabList, this.tabPanels);
  }

  @Method()
  async guxActivate(name: string): Promise<void> {
    this.activateTab(name, this.tabList, this.tabPanels);
  }

  private onSlotchange(): void {
    const [tabListSlot, defaultSlot] = Array.from(
      this.root.shadowRoot.querySelectorAll('slot')
    );

    this.tabList =
      tabListSlot.assignedElements()[0] as HTMLGuxBasicTabListElement;
    this.tabPanels =
      defaultSlot.assignedElements() as HTMLGuxBasicTabPanelElement[];

    this.activateTab(this.activeTab, this.tabList, this.tabPanels);
  }

  private activateTab(
    name: string,
    tabList: HTMLGuxBasicTabListElement,
    panels: HTMLGuxBasicTabPanelElement[]
  ): void {
    if (name) {
      this.activeTab = name;
    } else {
      this.activeTab = panels[0].name;
    }

    tabList.guxSetActive(this.activeTab);
    panels.forEach(panel => panel.guxSetActive(panel.name === this.activeTab));
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
