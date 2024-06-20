import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidaComponent } from './vida.component';

describe('VidaComponent', () => {
  let component: VidaComponent;
  let fixture: ComponentFixture<VidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
