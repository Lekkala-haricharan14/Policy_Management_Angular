import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePolicy } from './update-policy';

describe('UpdatePolicy', () => {
  let component: UpdatePolicy;
  let fixture: ComponentFixture<UpdatePolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePolicy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
