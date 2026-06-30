import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eb10Combine } from './eb10-combine';

describe('Eb10Combine', () => {
  let component: Eb10Combine;
  let fixture: ComponentFixture<Eb10Combine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eb10Combine],
    }).compileComponents();

    fixture = TestBed.createComponent(Eb10Combine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
