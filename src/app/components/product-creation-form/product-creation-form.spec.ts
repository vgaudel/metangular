import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreationForm } from './product-creation-form';

describe('ProductCreationForm', () => {
  let component: ProductCreationForm;
  let fixture: ComponentFixture<ProductCreationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
