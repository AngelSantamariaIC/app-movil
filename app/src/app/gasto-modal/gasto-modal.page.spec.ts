import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GastoModalPage } from './gasto-modal.page';

describe('GastoModalPage', () => {
  let component: GastoModalPage;
  let fixture: ComponentFixture<GastoModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GastoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
