import { async, ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { Hero } from "../hero";
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService: jasmine.SpyObj<HeroService>, mockLocation: jasmine.SpyObj<Location>;
    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj<HeroService>(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj<Location>(['back']);
        mockActivatedRoute = {
            snapshot: { paramMap: { get: () => { return '3' } } }
        };
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Location, useValue: mockLocation },
                { provide: HeroService, useValue: mockHeroService }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(HeroDetailComponent);
        mockActivatedRoute.testParams = { myparam: '3' };
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 44 } as Hero));
    });

    it('should render a hero name in a h2 tag', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
    });

    it('should call updateHero when save is called (timeout)', (done: () => void) => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        // act
        fixture.componentInstance.save();

        // assert
        setTimeout(() => {
            expect(mockHeroService.updateHero).toHaveBeenCalled();
            done();
        }, 251);
    });

    it('should call updateHero when save is called (fakeAsync)', fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        // act
        fixture.componentInstance.save();
        // tick(250);
        flush();

        // assert
        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }));

    it('should call updateHero when save is called (Async)', waitForAsync(() => {
        // arrange
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        // act
        fixture.componentInstance.save();

        // assert
        fixture.whenStable().then(() => {
            expect(mockHeroService.updateHero).toHaveBeenCalled();
        });

    }));
});
