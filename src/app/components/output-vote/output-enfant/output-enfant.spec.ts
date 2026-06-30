import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputEnfant } from './output-enfant';

describe('OutputEnfant', () => {
  let component: OutputEnfant;
  let fixture: ComponentFixture<OutputEnfant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputEnfant],
    }).compileComponents();

    fixture = TestBed.createComponent(OutputEnfant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
