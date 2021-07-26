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

@Component({
  styleUrl: 'gux-tab-list.less',
  tag: 'gux-tab-list'
})
export class GuxTabList {
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

  private onSlotchange(): void {
    this.tabTriggers = this.root.shadowRoot
      .querySelector('slot')
      .assignedElements() as HTMLGuxTabTriggerElement[];
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

  componentDidLoad() {
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    this.tabTriggers = this.root.querySelectorAll('gux-tab-trigger');
    // .assignedElements() as HTMLGuxTabTriggerElement[];

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
        {this.renderScrollButton('scrollLeft')}

        <div role="tablist" class="scrollable-section">
          <slot onSlotchange={this.onSlotchange.bind(this)}></slot>
        </div>
        {this.renderScrollButton('scrollRight')}
      </div>
    );
  }

  private renderScrollButton(direction: string): JSX.Element {
    return (
      <div class="scroll-button-container">
        {this.hasScrollbar ? (
          <button
            // title={this.i18n(direction)}
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
}
