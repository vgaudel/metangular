import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExosIO } from './exos-io';

describe('ExosIO', () => {
  let component: ExosIO;
  let fixture: ComponentFixture<ExosIO>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExosIO],
    }).compileComponents();

    fixture = TestBed.createComponent(ExosIO);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
