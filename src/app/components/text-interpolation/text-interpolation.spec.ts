import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInterpolation } from './text-interpolation';

describe('TextInterpolation', () => {
  let component: TextInterpolation;
  let fixture: ComponentFixture<TextInterpolation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInterpolation],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInterpolation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
