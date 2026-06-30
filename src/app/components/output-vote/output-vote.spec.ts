import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputVote } from './output-vote';

describe('OutputVote', () => {
  let component: OutputVote;
  let fixture: ComponentFixture<OutputVote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputVote],
    }).compileComponents();

    fixture = TestBed.createComponent(OutputVote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
