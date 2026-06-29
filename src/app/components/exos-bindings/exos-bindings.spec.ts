import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExosBindings } from './exos-bindings';

describe('ExosBindings', () => {
  let component: ExosBindings;
  let fixture: ComponentFixture<ExosBindings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExosBindings],
    }).compileComponents();

    fixture = TestBed.createComponent(ExosBindings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
