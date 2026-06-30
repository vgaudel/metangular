import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentExemple } from './parent-exemple';

describe('ParentExemple', () => {
  let component: ParentExemple;
  let fixture: ComponentFixture<ParentExemple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentExemple],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentExemple);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
