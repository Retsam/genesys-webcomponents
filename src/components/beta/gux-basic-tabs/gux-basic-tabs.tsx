import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Prop,
  readTask,
  State,
  Watch,
  writeTask
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { whenEventIsFrom } from '../../../utils/dom/when-event-is-from';

import tabsResources from './i18n/en.json';

import {
  GuxBasicTabsOrientation,
  GuxBasicTabsAlignment,
  GuxBasicTabsActiveTabId
} from './gux-basic-tabs.types';

@Component({
  styleUrl: 'gux-basic-tabs.less',
  tag: 'gux-basic-tabs',
  shadow: true
})
export class GuxBasicTabs {
  /**
   * tabId of the active tab
   */
  @Prop()
  value: string = '';

  /**
   * Tab orientation
   */
  @Prop()
  orientation: GuxBasicTabsOrientation = 'horizontal';

  /**
   * Tab alignment
   */
  @Prop()
  alignment: GuxBasicTabsAlignment = 'left';

  /**
   * Id of the active tab
   */
  @Prop()
  activeTabId: GuxBasicTabsActiveTabId;

  /**
   * Triggers when a tab is active.
   */
  @Event() input: EventEmitter;

  @Element()
  private root: HTMLElement;

  @State() private hasScrollbar: boolean = false;

  private i18n: GetI18nValue;

  private resizeObserver?: ResizeObserver;

  private domObserver?: MutationObserver;

  @Watch('activeTabId')
  watchHandler() {
    const tabs: HTMLGuxBasicTabElement[] = Array.from(
      this.root.querySelectorAll('gux-basic-tab')
    );
    for (const tab of tabs) {
      if (tab.tabId === this.activeTabId) {
        tab.active = true;
      } else {
        tab.active = false;
      }
    }
  }

  @Listen('internaltabactive')
  internaltabactiveHandler(e: CustomEvent) {
    whenEventIsFrom('gux-basic-tab', e, elem => {
      const tab = elem as HTMLGuxBasicTabElement;
      if (!tab.active) {
        this.activeTabId = tab.tabId;
        this.value = tab.tabId;
        this.input.emit();
      }
    });
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(
        this.root.shadowRoot.querySelector('.gux-basic-tabs')
      );
    }

    if (this.domObserver) {
      this.domObserver.disconnect();
    }
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, tabsResources);
  }

  checkForScrollbarHideOrShow() {
    readTask(() => {
      const el = this.root.shadowRoot.querySelector('.scrollable-section');
      const hasScrollbar = el.clientWidth !== el.scrollWidth;

      if (hasScrollbar !== this.hasScrollbar) {
        this.hasScrollbar = hasScrollbar;
      }
    });
  }

  componentDidLoad() {
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.resizeObserver) {
      this.resizeObserver.observe(
        this.root.shadowRoot.querySelector('.gux-basic-tabs')
      );
    }

    if (!this.domObserver && window.MutationObserver) {
      this.domObserver = new MutationObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.domObserver) {
      this.domObserver.observe(this.root, {
        childList: true,
        attributes: false,
        subtree: true
      });
    }

    setTimeout(() => {
      this.checkForScrollbarHideOrShow();
    }, 500);
  }

  componentDidRender() {
    setTimeout(() => {
      readTask(() => {
        if (this.activeTabId) {
          const activeTab: any = this.root.querySelector(
            `gux-basic-tab[tab-id='${this.activeTabId}']`
          );
          if (activeTab) {
            activeTab.active = true;
          }
        }
      });
    }, 500);
    this.renderTabpanelContent();
  }

  scrollLeft() {
    writeTask(() => {
      this.root.shadowRoot
        .querySelector('.scrollable-section')
        .scrollBy(-100, 0);
    });
  }

  scrollRight() {
    writeTask(() => {
      this.root.shadowRoot
        .querySelector('.scrollable-section')
        .scrollBy(100, 0);
    });
  }

  render() {
    return [
      <div
        class={`gux-basic-tabs gux-${this.alignment} gux-${this.orientation}`}
      >
        {this.renderScrollButton('scrollLeft')}
        <div class="scrollable-section">
          <slot name="tabs" />
        </div>
        {this.renderScrollButton('scrollRight')}
      </div>,
      <div class="gux-tabpanel-container"></div>
    ];
  }

  private renderScrollButton(direction: string): JSX.Element {
    return (
      <div class="scroll-button-container">
        {this.hasScrollbar ? (
          <button
            title={this.i18n(direction)}
            class="scroll-button"
            onClick={() =>
              direction === 'scrollLeft'
                ? this.scrollLeft()
                : this.scrollRight()
            }
          >
            <gux-icon
              icon-name={
                // will also need to add scroll up and down for vertical orientation
                direction === 'scrollLeft' ? 'chevron-left' : 'chevron-right'
              }
              decorative={true}
            />
          </button>
        ) : null}
      </div>
    );
  }

  private renderTabpanelContent(): void {
    const tabpanelContainer = this.root.shadowRoot.querySelector(
      '.gux-tabpanel-container'
    );
    if (tabpanelContainer) {
      tabpanelContainer.innerHTML = '';
    }
    const tabs: HTMLGuxBasicTabElement[] = Array.from(
      this.root.querySelectorAll('gux-basic-tab')
    );

    for (const tab of tabs) {
      const tabpanel = tab.querySelector('[slot="tabContentPanel"]');
      const tabClone = tabpanel.cloneNode(true);

      if (tab.tabId === this.activeTabId) {
        if (tabClone && (tabClone as HTMLElement).hasAttribute('hidden')) {
          (tabClone as HTMLElement).removeAttribute('hidden');
        }
        if (tabpanelContainer) {
          tabpanelContainer.appendChild(tabClone as HTMLElement);
        }
      }
    }
  }
}
