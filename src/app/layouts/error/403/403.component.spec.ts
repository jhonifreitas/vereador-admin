import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPermissionPage } from './403.component';

describe('NotPermissionPage', () => {
  let component: NotPermissionPage;
  let fixture: ComponentFixture<NotPermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPermissionPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
