import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCongesComponent } from './liste-conges.component';

describe('ListeCongesComponent', () => {
  let component: ListeCongesComponent;
  let fixture: ComponentFixture<ListeCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCongesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
