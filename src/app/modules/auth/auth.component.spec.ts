import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormPage } from './auth.component';

describe('AuthFormPage', () => {
  let component: AuthFormPage;
  let fixture: ComponentFixture<AuthFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthFormPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
