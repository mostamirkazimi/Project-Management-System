import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCode } from './activate-code';

describe('ActivateCode', () => {
  let component: ActivateCode;
  let fixture: ComponentFixture<ActivateCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateCode],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateCode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
