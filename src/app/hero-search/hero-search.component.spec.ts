import { Directive, Input } from "@angular/core";
import { ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroSearchComponent } from "./hero-search.component";

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('Hero-SearchComponent', () => {
    let target: ComponentFixture<HeroSearchComponent>;
    let mockService: jasmine.SpyObj<HeroService>;
    let HEROES: Hero[];

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful World', strength: 33 },
            { id: 3, name: 'SuperDude', strength: 4 }
        ]
        
        mockService = jasmine.createSpyObj<HeroService>(['searchHeroes']);

        TestBed.configureTestingModule({
            declarations: [HeroSearchComponent, RouterLinkDirectiveStub],
            providers: [{provide: HeroService, useValue: mockService}]
        });

        target = TestBed.createComponent(HeroSearchComponent);
    });

    it('should call search service with input value', (done: () => void) => {

        mockService.searchHeroes.and.returnValue(of(HEROES));

        const inputElement = target.debugElement.query(By.css('input')).nativeElement;

        inputElement.value = 'foo';
        const inputHandler = target.debugElement.query(By.css('input'));
        inputHandler.triggerEventHandler('keyup', 'foo');

        target.detectChanges();

        target.componentInstance.heroes$.subscribe((message ) => {
            console.log('subscripper: ', message);
        })

        inputHandler.triggerEventHandler('keyup', 'foobar');
        target.detectChanges();

        setTimeout(() => {
            expect(mockService.searchHeroes).toHaveBeenCalledWith('foo');
            done();
        }, 301);

    });
});

