import {
  Component,
  Element,
  h,
  JSX,
  Listen,
  Method,
  readTask,
  State,
  writeTask
} from '@stencil/core';

import { OnMutation } from '../../../../utils/decorator/on-mutation';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';

import tabsResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-basic-tab-list.less',
  tag: 'gux-basic-tab-list'
})
export class GuxBasicTabList {
  private i18n: GetI18nValue;
  private triggerIds: string;

  @Element()
  root: HTMLElement;

  @State()
  focused: number = 0;

  @State()
  tabTriggers: any;

  @State()
  private hasScrollbar: boolean = false;

  private resizeObserver?: ResizeObserver;

  private domObserver?: MutationObserver;

  @OnMutation({ childList: true, subtree: true })
  onMutation(): void {
    this.triggerIds = Array.from(
      this.root.querySelector('.scrollable-section').children
    )
      .map(trigger => trigger.getAttribute('trigger-id'))
      .join(' ');
  }

  @Listen('keyup')
  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.focusPanel(
          this.focused ? this.focused - 1 : this.tabTriggers.length - 1
        );
        break;
      case 'ArrowRight':
        this.focusPanel((this.focused + 1) % this.tabTriggers.length);
        break;
    }
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        this.focusPanel(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusPanel(this.tabTriggers.length - 1);
        break;
    }
  }

  @Method()
  async guxSetActive(activePanelId: string): Promise<void> {
    this.tabTriggers.forEach((tabTrigger, index) => {
      const active = tabTrigger.panelId === activePanelId;

      tabTrigger.guxSetActive(active);

      if (active) {
        this.focused = index;
      }
    });
  }

  private focusPanel(index: number): void {
    this.focused = index;
    this.tabTriggers[this.focused].guxFocus();
  }

  checkForScrollbarHideOrShow() {
    readTask(() => {
      const el = this.root.querySelector('.scrollable-section');
      const hasScrollbar = el.clientWidth !== el.scrollWidth;
      if (hasScrollbar !== this.hasScrollbar) {
        this.hasScrollbar = hasScrollbar;
      }
    });
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.root.querySelector('.tab-container'));
    }

    if (this.domObserver) {
      this.domObserver.disconnect();
    }
  }

  async componentWillLoad(): Promise<void> {
    this.tabTriggers = this.root.querySelectorAll('gux-basic-tab-trigger');
    this.i18n = await buildI18nForComponent(this.root, tabsResources);
  }

  componentDidLoad() {
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.resizeObserver) {
      this.resizeObserver.observe(this.root.querySelector('.tab-container'));
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

  scrollLeft() {
    writeTask(() => {
      this.root.querySelector('.scrollable-section').scrollBy(-100, 0);
    });
  }

  scrollRight() {
    writeTask(() => {
      this.root.querySelector('.scrollable-section').scrollBy(100, 0);
    });
  }

  render(): JSX.Element {
    return (
      <div class="tab-container">
        {this.hasScrollbar
          ? this.renderScrollButton('scrollLeft')
          : this.renderScrollButton('scrollUp')}

        <div
          role="tablist"
          class="scrollable-section"
          aria-owns={this.triggerIds}
        >
          <slot></slot>
        </div>
        {this.hasScrollbar
          ? this.renderScrollButton('scrollRight')
          : this.renderScrollButton('scrollDown')}
      </div>
    );
  }

  private renderScrollButton(direction: string): JSX.Element {
    return (
      <div class="scroll-button-container">
        {this.hasScrollbar ? (
          <button
            title={this.i18n(direction)}
            aria-label={this.i18n(direction)}
            class="scroll-button"
            onClick={() =>
              direction === 'scrollLeft'
                ? this.scrollLeft()
                : this.scrollRight()
            }
          >
            <gux-icon
              icon-name={
                direction === 'scrollLeft' ? 'chevron-left' : 'chevron-right'
              }
              decorative={true}
            />
          </button>
        ) : null}
      </div>
    );
  }
}
