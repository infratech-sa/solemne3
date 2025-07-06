import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentStatisticsComponent } from './incident-statistics.component';

describe('IncidentStatisticsComponent', () => {
  let component: IncidentStatisticsComponent;
  let fixture: ComponentFixture<IncidentStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
