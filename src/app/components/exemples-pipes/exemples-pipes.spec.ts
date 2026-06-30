import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemplesPipes } from './exemples-pipes';

describe('ExemplesPipes', () => {
  let component: ExemplesPipes;
  let fixture: ComponentFixture<ExemplesPipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExemplesPipes],
    }).compileComponents();

    fixture = TestBed.createComponent(ExemplesPipes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
