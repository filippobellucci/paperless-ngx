import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core'
import { SettingsService } from 'src/app/services/settings.service'
import { icons } from './icons'
import { iconsLine } from './icons-line'

/** Converts icon name e.g. `arrow-down-up` to its registry key. */
const toKey = (name: string) =>
  name.trim().replace(/-(.)/g, (_, char: string) => char.toUpperCase())

/**
 * Renders an icon as inline SVG: from the bootstrap-icons package under the
 * Classic theme preset, otherwise from the Lucide line set with a Bootstrap
 * fallback. Icons must be registered in `./icons.ts` (and `./icons-line.ts`).
 */
@Component({
  selector: 'pngx-bs-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootstrapIconComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>)
  private readonly settingsService = inject(SettingsService)

  readonly name = input<string>()
  readonly width = input<string | number>()
  readonly height = input<string | number>()

  constructor() {
    effect(() => {
      const element = this.elementRef.nativeElement
      element.innerHTML = this.svg()
      const svg = element.firstElementChild
      if (!svg) return
      // Bootstrap icons are 16 px by default; Lucide ones (24 px) are sized to match.
      svg.setAttribute('width', String(this.width() || 16))
      svg.setAttribute('height', String(this.height() || 16))
    })
  }

  private svg(): string {
    const name = this.name()
    if (!name) return ''
    const key = toKey(name)
    const svg =
      this.settingsService.themePreset() === 'classic'
        ? icons[key]
        : (iconsLine[key] ?? icons[key])
    if (!svg) {
      console.warn(`Icon not found: ${name}`)
      return ''
    }
    return svg
  }
}
