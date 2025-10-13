import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCode } from './admin-code';

describe('AdminCode', () => {
  let component: AdminCode;
  let fixture: ComponentFixture<AdminCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
