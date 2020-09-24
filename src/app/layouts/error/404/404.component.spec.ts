import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Error404Page } from './404.component';

describe('Error404Page', () => {
  let component: Error404Page;
  let fixture: ComponentFixture<Error404Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error404Page ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
