import { Directive, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

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

describe('HeroesComponent  (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService: jasmine.SpyObj<HeroService>;
    let HEROES: Hero[]

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful World', strength: 33 },
            { id: 3, name: 'SuperDude', strength: 4 }
        ]

        mockHeroService = jasmine.createSpyObj<HeroService>(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); // run ngOnInit

        const heroComponentsDes = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // console.log(heroComponentsDes);
        // expect(heroComponentsDes.length).toBe(3);
        // expect(heroComponentsDes[0].componentInstance.hero.name).toEqual('SpiderDude');
        // expect(heroComponentsDes[1].componentInstance.hero.name).toEqual('Wonderful World');
        // expect(heroComponentsDes[2].componentInstance.hero.name).toEqual('SuperDude');

        for (let index = 0; index < heroComponentsDes.length; index++) {
            expect(heroComponentsDes[index].componentInstance.hero).toEqual(HEROES[index]);
        }
    });

    it(`should call heroService.deleteHero when the Hero Component's
        delete button is clicked`, () => {
        // arrange
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        const expectedHeroId = 0;

        fixture.detectChanges(); // run ngOnInit

        const heroComponentsDes = fixture.debugElement.queryAll(By.directive(HeroComponent));

        // act
        // 1. way
        // heroComponentsDes[expectedHeroId].query(By.css('button'))
        //     .triggerEventHandler('click', { stopPropagation: () => {} });
        // 2. way - I quess this is the best way
        // (<HeroComponent>heroComponentsDes[expectedHeroId].componentInstance).delete.emit(undefined);
        // 3. way
        heroComponentsDes[0].triggerEventHandler('delete', null);

        // assert
        expect(fixture.componentInstance.delete)
            .toHaveBeenCalledWith(HEROES[expectedHeroId]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
        // arrange
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); // run ngOnInit
        const expected = { id: 5, name: 'Mr. Ice Man', strength: 4 } as Hero;
        mockHeroService.addHero.and.returnValue(of(expected));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        // even Heroes has only one button child element(s) has also buttons
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        // act
        inputElement.value = expected.name;
        addButton.triggerEventHandler('click', null);

        // assert
        fixture.detectChanges();
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        // console.log(heroText);
        expect(heroText).toContain(expected.name);
    });

    it('should not call hero service add is called without name', () => {
        // arrange
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); // run ngOnInit

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        // even Heroes has only one button child element(s) has also buttons
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        // act
        inputElement.value = '';
        addButton.triggerEventHandler('click', null);

        // assert
        fixture.detectChanges();
        expect(mockHeroService.addHero).toHaveBeenCalledTimes(0);
    });

    it('should have the correct route for the first hero', () => {
        // arrange
        const expectedId = 1;
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); // run ngOnInit
        
        // act
        const heroCompomponentDes = fixture.debugElement.queryAll(By.directive(HeroComponent));
        
        let routerLink = heroCompomponentDes[expectedId - 1]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);

        heroCompomponentDes[expectedId - 1].query(By.css('a')).triggerEventHandler('click', null);

        // assert
        expect(routerLink.navigatedTo).toBe(`/detail/${expectedId}`);
    });
});
