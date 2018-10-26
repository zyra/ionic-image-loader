import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgContentPage } from './ng-content.page';

describe('NgContentPage', () => {
  let component: NgContentPage;
  let fixture: ComponentFixture<NgContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgContentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
