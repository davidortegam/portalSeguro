import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VencimientoComponent } from './vencimiento.component';

describe('VencimientoComponent', () => {
  let component: VencimientoComponent;
  let fixture: ComponentFixture<VencimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VencimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
