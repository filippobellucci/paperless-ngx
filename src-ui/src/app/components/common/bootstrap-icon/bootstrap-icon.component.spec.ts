import { signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ThemePreset } from 'src/app/data/ui-settings'
import { SettingsService } from 'src/app/services/settings.service'
import { BootstrapIconComponent } from './bootstrap-icon.component'
import { icons } from './icons'
import { iconsLine } from './icons-line'

describe('BootstrapIconComponent', () => {
  let fixture: ComponentFixture<BootstrapIconComponent>
  let themePreset: ReturnType<typeof signal<ThemePreset>>

  beforeEach(() => {
    themePreset = signal<ThemePreset>('classic')
    TestBed.configureTestingModule({
      imports: [BootstrapIconComponent],
      providers: [{ provide: SettingsService, useValue: { themePreset } }],
    })
    fixture = TestBed.createComponent(BootstrapIconComponent)
  })

  it('should render the named icon as inline svg', () => {
    fixture.componentRef.setInput('name', 'arrow-down-up')
    fixture.detectChanges()
    const svg: SVGElement = fixture.nativeElement.querySelector('svg')
    expect(svg.classList).toContain('bi-arrow-down-up')
    expect(svg.getAttribute('width')).toEqual('16')
    expect(svg.getAttribute('height')).toEqual('16')
  })

  it('should apply width and height', () => {
    fixture.componentRef.setInput('name', 'x-lg')
    fixture.componentRef.setInput('width', '1.2em')
    fixture.componentRef.setInput('height', 2)
    fixture.detectChanges()
    const svg: SVGElement = fixture.nativeElement.querySelector('svg')
    expect(svg.getAttribute('width')).toEqual('1.2em')
    expect(svg.getAttribute('height')).toEqual('2')
  })

  it('should not allow width or height to inject attributes', () => {
    fixture.componentRef.setInput('name', 'x-lg')
    fixture.componentRef.setInput('width', '1" onload="alert(1)')
    fixture.componentRef.setInput('height', '1" onclick="alert(1)')
    fixture.detectChanges()
    const svg: SVGElement = fixture.nativeElement.querySelector('svg')
    expect(svg.hasAttribute('onload')).toBe(false)
    expect(svg.hasAttribute('onclick')).toBe(false)
    expect(svg.getAttribute('width')).toEqual('1" onload="alert(1)')
  })

  it('should update when the name changes', () => {
    fixture.componentRef.setInput('name', 'x-lg')
    fixture.detectChanges()
    fixture.componentRef.setInput('name', 'sliders2-vertical')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('svg').classList).toContain(
      'bi-sliders2-vertical'
    )
  })

  it('should render nothing and warn for an unregistered icon', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    fixture.componentRef.setInput('name', 'not-an-icon')
    fixture.detectChanges()
    expect(fixture.nativeElement.innerHTML).toEqual('')
    expect(warnSpy).toHaveBeenCalledWith('Icon not found: not-an-icon')
  })

  it('should render the line icon under a non-Classic preset', () => {
    themePreset.set('refined')
    fixture.componentRef.setInput('name', 'arrow-down-up')
    fixture.detectChanges()
    const svg: SVGElement = fixture.nativeElement.querySelector('svg')
    expect(svg.classList).toContain('lucide-arrow-down-up')
    expect(svg.getAttribute('width')).toEqual('16')
    expect(svg.getAttribute('height')).toEqual('16')
  })

  it('should apply width and height to line icons', () => {
    themePreset.set('slate')
    fixture.componentRef.setInput('name', 'x-lg')
    fixture.componentRef.setInput('width', '1.2em')
    fixture.detectChanges()
    const svg: SVGElement = fixture.nativeElement.querySelector('svg')
    expect(svg.classList).toContain('lucide-x')
    expect(svg.getAttribute('width')).toEqual('1.2em')
    expect(svg.getAttribute('height')).toEqual('16')
  })

  it('should fall back to the Bootstrap icon when no line icon exists', () => {
    themePreset.set('refined')
    fixture.componentRef.setInput('name', 'google')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('svg').classList).toContain(
      'bi-google'
    )
  })

  it('should re-render when the theme preset changes', () => {
    fixture.componentRef.setInput('name', 'house')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('svg').classList).toContain(
      'bi-house'
    )
    themePreset.set('paper')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('svg').classList).toContain(
      'lucide-house'
    )
    themePreset.set('classic')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('svg').classList).toContain(
      'bi-house'
    )
  })

  it('should have a line icon for every registered icon except brand logos', () => {
    const missing = Object.keys(icons).filter((key) => !iconsLine[key])
    expect(missing).toEqual(['google', 'microsoft'])
    expect(Object.keys(iconsLine).filter((key) => !icons[key])).toEqual([])
  })
})
