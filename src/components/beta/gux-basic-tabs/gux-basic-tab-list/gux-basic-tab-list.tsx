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
// import { getRootIconName } from '../../../stable/gux-icon/gux-icon.service';

@Component({
  styleUrl: 'gux-basic-tab-list.less',
  tag: 'gux-basic-tab-list'
})
export class GuxBasicTabList {
  private triggerIds: string;

  @Element()
  root: HTMLElement;

  @State()
  focused: number = 0;

  @State()
  tabTriggers: any;

  @State()
  private hasScrollbar: boolean = false;

  private hasVerticalScrollbar: boolean = false;

  private resizeObserver?: ResizeObserver;

  // private resizeObserverVertical?: ResizeObserver;

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

  // private onSlotchange(): void {
  //   this.tabTriggers = this.root.shadowRoot
  //     .querySelector('slot')
  //     .assignedElements() as HTMLGuxTabTriggerElement[];
  // }

  checkForScrollbarHideOrShow() {
    readTask(() => {
      const el = this.root.querySelector('.scrollable-section');
      const hasScrollbar = el.clientWidth !== el.scrollWidth;
      const hasVerticalScrollbar = el.clientHeight !== el.scrollHeight;

      if (hasScrollbar !== this.hasScrollbar) {
        this.hasScrollbar = hasScrollbar;
      }

      if (hasVerticalScrollbar !== this.hasVerticalScrollbar) {
        this.hasVerticalScrollbar = hasVerticalScrollbar;
      }
    });
  }

  componentDidLoad() {
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    this.tabTriggers = this.root.querySelectorAll('gux-basic-tab-trigger');

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

  scrollUp() {
    writeTask(() => {
      this.root.querySelector('.scrollable-section').scrollBy(0, -100);
    });
  }

  scrollDown() {
    writeTask(() => {
      this.root.querySelector('.scrollable-section').scrollBy(0, 100);
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
        {this.hasScrollbar || this.hasVerticalScrollbar ? (
          <button
            // title={this.i18n(direction)}
            class="scroll-button"
            onClick={() => this.getScrollDirection(direction)}
          >
            <gux-icon
              icon-name={this.getChevronIconName(direction)}
              decorative={true}
            />
          </button>
        ) : null}
      </div>
    );
  }

  private getScrollDirection(direction: string): void {
    switch (direction) {
      case 'scrollLeft':
        this.scrollLeft();
        break;
      case 'scrollRight':
        this.scrollRight();
        break;
      case 'scrollUp':
        this.scrollUp();
        break;
      case 'scrollDown':
        this.scrollDown();
    }
  }

  private getChevronIconName(direction: string): string {
    switch (direction) {
      case 'scrollLeft':
        return 'chevron-left';
      case 'scrollRight':
        return 'chevron-right';
      case 'scrollUp':
        return 'chevron-up';
      case 'scrollDown':
        return 'chevron-down';
    }
  }
}
