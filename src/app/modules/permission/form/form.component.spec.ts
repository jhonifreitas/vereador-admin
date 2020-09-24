import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempleFormPage } from './form.component';

describe('TempleFormPage', () => {
  let component: TempleFormPage;
  let fixture: ComponentFixture<TempleFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempleFormPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempleFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
