import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsPage } from './avatars.page';

describe('AvatarsPage', () => {
  let component: AvatarsPage;
  let fixture: ComponentFixture<AvatarsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
