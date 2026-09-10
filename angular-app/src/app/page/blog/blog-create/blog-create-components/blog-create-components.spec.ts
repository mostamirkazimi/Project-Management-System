import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCreateComponents } from './blog-create-components';

describe('BlogCreateComponents', () => {
  let component: BlogCreateComponents;
  let fixture: ComponentFixture<BlogCreateComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCreateComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCreateComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
