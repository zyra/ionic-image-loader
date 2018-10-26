import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderPage } from './slider.page';

describe('SliderPage', () => {
  let component: SliderPage;
  let fixture: ComponentFixture<SliderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
