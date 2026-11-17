import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { ThemePickerComponent } from './theme-picker.component'

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent
  let fixture: ComponentFixture<ThemePickerComponent>

  const radios = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role=radio]'))

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ThemePickerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ThemePickerComponent)
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should show one card per preset and mark the written value', () => {
    const presets = ['refined', 'classic', 'slate', 'paper', 'contrast']
    expect(radios().length).toEqual(presets.length)
    radios().forEach((radio, i) =>
      expect(
        radio
          .querySelector('.theme-swatch')
          .classList.contains(`pngx-theme-swatch-${presets[i]}`)
      ).toBe(true)
    )
    component.writeValue('slate')
    fixture.detectChanges()
    expect(radios().map((r) => r.getAttribute('aria-checked'))).toEqual([
      'false',
      'false',
      'true',
      'false',
      'false',
    ])
    expect(radios()[2].tabIndex).toEqual(0)
    expect(radios()[0].tabIndex).toEqual(-1)
  })

  it('should show the default preset as selected for an unknown value', () => {
    component.writeValue('unknown' as any)
    fixture.detectChanges()
    expect(radios()[0].getAttribute('aria-checked')).toEqual('true')
  })

  it('should report a click on a card', () => {
    const onChange = jest.fn()
    component.registerOnChange(onChange)
    component.writeValue('refined')
    radios()[3].click()
    expect(onChange).toHaveBeenCalledWith('paper')
    expect(component.value).toEqual('paper')
    radios()[3].click()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should move the selection and focus with arrow keys, wrapping around', () => {
    const onChange = jest.fn()
    component.registerOnChange(onChange)
    component.writeValue('refined')
    fixture.detectChanges()
    radios()[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    )
    expect(onChange).toHaveBeenLastCalledWith('contrast')
    fixture.detectChanges()
    expect(document.activeElement).toBe(radios()[4])
    radios()[4].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    )
    expect(onChange).toHaveBeenLastCalledWith('refined')
    radios()[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    )
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('should not change when disabled', () => {
    const onChange = jest.fn()
    component.registerOnChange(onChange)
    component.writeValue('refined')
    component.setDisabledState(true)
    fixture.detectChanges()
    expect(radios().every((r) => r.disabled)).toBe(true)
    component.select('slate')
    expect(onChange).not.toHaveBeenCalled()
  })
})
