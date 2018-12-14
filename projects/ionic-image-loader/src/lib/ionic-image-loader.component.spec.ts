import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonicImageLoaderComponent } from './ionic-image-loader.component';

describe('IonicImageLoaderComponent', () => {
  let component: IonicImageLoaderComponent;
  let fixture: ComponentFixture<IonicImageLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IonicImageLoaderComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonicImageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
