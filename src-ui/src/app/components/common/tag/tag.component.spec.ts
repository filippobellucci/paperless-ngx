import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs'
import { Tag } from 'src/app/data/tag'
import { PermissionsService } from 'src/app/services/permissions.service'
import { TagService } from 'src/app/services/rest/tag.service'
import { TagComponent } from './tag.component'

const tag: Tag = {
  id: 1,
  color: '#ff0000',
  name: 'Tag1',
}

describe('TagComponent', () => {
  let component: TagComponent
  let fixture: ComponentFixture<TagComponent>
  let permissionsService: PermissionsService
  let tagService: TagService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
      imports: [TagComponent],
    }).compileComponents()

    permissionsService = TestBed.inject(PermissionsService)
    tagService = TestBed.inject(TagService)
    fixture = TestBed.createComponent(TagComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should expose tag colours as custom properties', () => {
    component.tag.set({ ...tag, text_color: '#ffffff' })
    fixture.detectChanges()
    const style: CSSStyleDeclaration = fixture.debugElement.query(
      By.css('span')
    ).nativeElement.style
    expect(style.getPropertyValue('--pngx-tag-color')).toEqual('#ff0000')
    expect(style.getPropertyValue('--pngx-tag-text-color')).toEqual('#ffffff')
  })

  it('should expose tag colours on clickable badges', () => {
    component.tag.set(tag)
    fixture.componentRef.setInput('clickable', true)
    fixture.detectChanges()
    expect(
      fixture.debugElement
        .query(By.css('a.badge'))
        .nativeElement.style.getPropertyValue('--pngx-tag-color')
    ).toEqual('#ff0000')
  })

  it('should handle private tags', () => {
    expect(
      fixture.debugElement.query(By.css('span')).nativeElement.textContent
    ).toEqual('Private')
  })

  it('should support clickable option', () => {
    component.tag.set(tag)
    fixture.detectChanges()
    expect(fixture.debugElement.query(By.css('a.badge'))).toBeNull()
    fixture.componentRef.setInput('clickable', true)
    fixture.detectChanges()
    expect(fixture.debugElement.query(By.css('a.badge'))).not.toBeNull()
  })

  it('should support retrieving tag by ID', () => {
    jest.spyOn(permissionsService, 'currentUserCan').mockReturnValue(true)
    const getCachedSpy = jest.spyOn(tagService, 'getCached')
    getCachedSpy.mockReturnValue(of(tag))
    fixture.componentRef.setInput('tagID', 1)
    fixture.detectChanges()
    expect(getCachedSpy).toHaveBeenCalledWith(1)
    expect(component.tag()).toEqual(tag)
  })
})
