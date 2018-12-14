import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrencyPage } from './concurrency.page';

describe('ConcurrencyPage', () => {
  let component: ConcurrencyPage;
  let fixture: ComponentFixture<ConcurrencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrencyPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
