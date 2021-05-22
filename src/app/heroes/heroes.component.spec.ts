import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component";

describe('HerosComponent', () => {
    let target: HeroesComponent;
    let HEROES;
    let mockService;

    beforeEach(() => {
        HEROES = [
            {id:1, name: 'SpiderDude', strength: 8},
            {id:2, name: 'Wonderful World', strength: 33},
            {id:3, name: 'SuperDude', strength: 1}
        ]

        mockService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        target = new HeroesComponent(mockService);
    });

    describe('delete', () => {
        it('should remove hero from the heroes list', () => {
            // arrange
            mockService.deleteHero.and.returnValue(of(true));
            target.heroes = HEROES;

            // act
            target.delete(HEROES[2]);

            // assert
            expect(target.heroes.length).toBe(2);
        });

        it('should remove hero and id 1 in array pos 1', () => {
            // arrange
            mockService.deleteHero.and.returnValue(of(true));
            target.heroes = HEROES;

            // act
            target.delete(HEROES[2]);

            // assert
            expect(target.heroes[0].id).toBe(1);
        });

        it('should remove hero and id 2 in array pos 2', () => {
            // arrange
            mockService.deleteHero.and.returnValue(of(true));
            target.heroes = HEROES;

            // act
            target.delete(HEROES[2]);

            // assert
            expect(target.heroes[1].id).toBe(2);
        });

        it('should remove hero service called', () => {
            // arrange
            mockService.deleteHero.and.returnValue(of(true));
            target.heroes = HEROES;
            const actual = HEROES[2];

            // act
            target.delete(actual);

            // assert
            expect(mockService.deleteHero).toHaveBeenCalledWith(actual);
        });
    });

});