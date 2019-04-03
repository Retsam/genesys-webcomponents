import {
  Component,
  Event,
  EventEmitter,
  Prop,
  State,
  Watch
} from '@stencil/core';

let nextRadioId = 1;

@Component({
  styleUrl: 'gux-radio.less',
  tag: 'gux-radio'
})
export class GuxRadio {
  /**
   * The radio group name for this radio button.  Automatically
   * inherited/overwritten by a gux-radio-group.
   */
  @Prop({ mutable: true, reflectToAttr: true })
  name: string;

  /**
   * The form value to use for the radio button.
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: string;

  /**
   * Whether or not this radio is checked.
   */
  @Prop({ mutable: true, reflectToAttr: true })
  checked: boolean = false;

  /**
   * The message to label this radio with.
   */
  @Prop()
  label?: string;

  /**
   * Whether or not the radio is disabled.
   */
  @Prop()
  disabled: boolean = false;

  @State()
  id: number;

  /**
   * Fired when the checked status of the radio changes.
   */
  @Event()
  check!: EventEmitter<boolean>;

  /**
   * Fired when the component is loaded.  Used for communicating with the
   * radio group.
   *
   * @internal
   */
  @Event()
  guxRadioWillLoad!: EventEmitter<GuxRadio>;

  /**
   * Fired when the component is unloaded.  Used for communicating with the
   * radio group.
   *
   * @internal
   */
  @Event()
  guxRadioWillUnload!: EventEmitter<GuxRadio>;

  @Watch('checked')
  checkedChanged(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }

    this.check.emit(newValue);
  }

  componentWillLoad() {
    this.id = nextRadioId++;
    this.guxRadioWillLoad.emit(this);
  }

  componentWillUnload() {
    this.guxRadioWillUnload.emit(this);
  }

  render() {
    return (
      <div class="gux-radio-container">
        <input
          id={`gux-radio-${this.id}`}
          name={this.name}
          value={this.value}
          type="radio"
          onChange={e => this.onChecked(e)}
          onInput={e => this.onChecked(e)}
          disabled={this.disabled}
          // aria-labelledby={`gux-radio-label-${this.id}`}
          {...{ checked: this.checked ? true : undefined }}
        />
        <label
          id={`gux-radio-label-${this.id}`}
          htmlFor={`gux-radio-${this.id}`}
        >
          {this.label}
        </label>
      </div>
    );
  }

  hostData() {
    return {
      'aria-checked': this.checked + '',
      'aria-disabled': this.disabled + '',
      'aria-labelledby': `gux-radio-label-${this.id}`,
      role: 'radio'
      // TODO: Should we include an optional header/label?
      // 'aria-labelledby': this.labelId
    };
  }

  private onChecked(ev: Event) {
    ev.cancelBubble = true;
    this.checked = true;
  }
}
