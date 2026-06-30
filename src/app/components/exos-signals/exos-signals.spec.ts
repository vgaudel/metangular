import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExosSignals } from './exos-signals';

describe('ExosSignals', () => {
  let component: ExosSignals;
  let fixture: ComponentFixture<ExosSignals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExosSignals],
    }).compileComponents();

    fixture = TestBed.createComponent(ExosSignals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
