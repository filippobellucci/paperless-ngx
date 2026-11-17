import { Component, forwardRef } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import {
  DEFAULT_THEME_PRESET,
  THEME_PRESETS,
  ThemePreset,
} from 'src/app/data/ui-settings'
import { AbstractInputComponent } from '../abstract-input'

interface ThemeOption {
  id: ThemePreset
  name: string
  note: string
}

/** Radio group of theme preset cards; the swatches are styled by src/themes/_presets.scss. */
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThemePickerComponent),
      multi: true,
    },
  ],
  selector: 'pngx-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
})
export class ThemePickerComponent extends AbstractInputComponent<ThemePreset> {
  readonly options: ThemeOption[] = [
    {
      id: 'refined',
      name: $localize`Refined`,
      note: $localize`Inter, pine green, soft corners`,
    },
    {
      id: 'classic',
      name: $localize`Classic`,
      note: $localize`The original Paperless-ngx look`,
    },
    {
      id: 'slate',
      name: $localize`Slate`,
      note: $localize`Plus Jakarta Sans, petrol blue, dark bar`,
    },
    {
      id: 'paper',
      name: $localize`Paper`,
      note: $localize`Fraunces and Instrument Sans, warm tones`,
    },
    {
      id: 'contrast',
      name: $localize`High contrast`,
      note: $localize`Larger text, strong borders`,
    },
  ]

  constructor() {
    super()
  }

  /** The preset shown as selected: unknown or empty values show the default. */
  get selected(): ThemePreset {
    return THEME_PRESETS.includes(this.value)
      ? this.value
      : DEFAULT_THEME_PRESET
  }

  select(id: ThemePreset) {
    if (this.disabled || id === this.value) return
    this.value = id
    this.onChange(id)
    this.onTouched()
  }

  /** Arrow keys move the selection and the focus, as in a native radio group. */
  onKeydown(event: KeyboardEvent, index: number) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      event.key
    ]
    if (!step) return
    event.preventDefault()
    const next = (index + step + this.options.length) % this.options.length
    this.select(this.options[next].id)
    const radios = (event.currentTarget as HTMLElement)
      .closest('[role=radiogroup]')
      ?.querySelectorAll<HTMLElement>('[role=radio]')
    radios?.[next]?.focus()
  }
}
