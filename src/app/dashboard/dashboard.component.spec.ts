import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroSearchComponent } from "../hero-search/hero-search.component";
import { HeroService } from "../hero.service";
import { DashboardComponent } from "./dashboard.component";

describe('DashboardComponent', () => {
    let target: ComponentFixture<DashboardComponent>;
    let HEROES: Hero[];
    let mockService: jasmine.SpyObj<HeroService>;
    
    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'Foobar', strength: 424 }
        ];
        mockService = jasmine.createSpyObj<HeroService>(['getHeroes']);
   
        TestBed.configureTestingModule({
            declarations: [
                DashboardComponent,
                HeroSearchComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockService}
            ]
        });
        target = TestBed.createComponent(DashboardComponent);
    });

    it('should call hero service', () => {
        // assert
        mockService.getHeroes.and.returnValue(of(HEROES));

        // act
        target.detectChanges();

        // assert
        expect(mockService.getHeroes).toHaveBeenCalled();
    });
});