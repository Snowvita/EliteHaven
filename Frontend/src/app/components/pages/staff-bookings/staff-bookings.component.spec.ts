import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffBookingsComponent } from './staff-bookings.component';

describe('StaffBookingsComponent', () => {
  let component: StaffBookingsComponent;
  let fixture: ComponentFixture<StaffBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
