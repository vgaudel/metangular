import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfantExemple } from './enfant-exemple';

describe('EnfantExemple', () => {
  let component: EnfantExemple;
  let fixture: ComponentFixture<EnfantExemple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfantExemple],
    }).compileComponents();

    fixture = TestBed.createComponent(EnfantExemple);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
