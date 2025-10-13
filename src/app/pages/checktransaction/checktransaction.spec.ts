import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checktransaction } from './checktransaction';

describe('Checktransaction', () => {
  let component: Checktransaction;
  let fixture: ComponentFixture<Checktransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checktransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checktransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
