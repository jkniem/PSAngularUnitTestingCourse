import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { Hero } from "./hero";

describe('HeroService', () => {
    let mockMessageService: jasmine.SpyObj<MessageService>;
    let httpTestingController: HttpTestingController;
    let heroService: HeroService;
    let msgService: MessageService;

    beforeEach(() => {

        mockMessageService = jasmine.createSpyObj<MessageService>(['add', 'clear']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        heroService = TestBed.get(HeroService);
        msgService = TestBed.get(MessageService);
    });

    describe('getHero', () => {
        it('should call get with the correct URL', () => {
            // This is another way inject services than TestBed.get/inject -methods
            // inject([HeroService, HttpTestingController], 
            //     (service: HeroService, controller: HttpTestingController) => {
            let expected: Hero;
            // act
            heroService.getHero(4).subscribe((data) => {
                expected = data;
            });
            // heroService.getHero(3).subscribe();

            // assert
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            expect(expected.name).toContain('SuperDude');
            httpTestingController.verify();
        });
    });

    describe('getHeroes', () => {
        it('should call get with the correct URL', () => {
            let result: Hero[];

            // act
            heroService.getHeroes().subscribe((data) => {
                result = data;
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes');
            req.flush([]);
            expect(result).toEqual([]);
            httpTestingController.verify();
        });

        it('should contain items', () => {
            // arrange
            let heroes: Hero[];

            // act
            heroService.getHeroes().subscribe((data) => {
                heroes = data;
                // console.log('getheroes', data);
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes');
            req.flush([{ id: 4, name: 'SuperDude', strength: 100 }]);
            expect(heroes.length).toBeGreaterThan(0);
            httpTestingController.verify();
        });
    });

    describe('searchHeroes', () => {
        it('should return hero when search with part of the name', () => {
            let expected: Hero[];
            // act
            heroService.searchHeroes('foo').subscribe((data: Hero[]) => {
                expected = data;
                // console.log(data);
            });
            // heroService.getHero(3).subscribe();

            // assert
            const req = httpTestingController.expectOne('api/heroes/?name=foo');
            req.flush([{ id: 4, name: 'foobar', strength: 100 } as Hero]);
            expect(expected[0].name).toContain('foobar');
            console.log('search:', expected)
            httpTestingController.verify();
        });

        it('should return empty array if empty string', () => {
            let expected: Hero[];
            // act
            heroService.searchHeroes('').subscribe((data: Hero[]) => {
                expected = data;
                // console.log(data);
            });
            // heroService.getHero(3).subscribe();

            // assert
            httpTestingController.expectNone('api/heroes/?name=');
            expect(expected).toEqual([])
            console.log('search:', expected)
            httpTestingController.verify();
        });

        it('should return empty array if whitespaces', () => {
            let expected: Hero[];
            // act
            heroService.searchHeroes('   ').subscribe((data: Hero[]) => {
                expected = data;
                // console.log(data);
            });
            // heroService.getHero(3).subscribe();

            // assert
            httpTestingController.expectNone('api/heroes/?name=');
            expect(expected).toEqual([])
            httpTestingController.verify();
        });
    });

    describe('addHero', () => {
        it('should call get with the correct URL', () => {
            // arrange
            let expected: Hero;

            // act
            heroService.addHero(expected).subscribe((data) => {
                expected = data;
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            expect(expected.name).toContain('SuperDude');
            httpTestingController.verify();
        });
    });

    describe('deleteHero', () => {
        it('should call get with the correct URL when passing Hero object', () => {
            // arrange
            let actual = { id: 4, name: 'SuperDude', strength: 100 } as Hero
            let expected: Hero;

            // act
            heroService.deleteHero(actual).subscribe((data) => {
                expected = data;
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            expect(expected.name).toContain('SuperDude');
            httpTestingController.verify();
        });

        it('should call get with the correct URL when passing id', () => {
            // arrange
            let actual = { id: 4, name: 'SuperDude', strength: 100 } as Hero
            let expected: Hero;

            // act
            heroService.deleteHero(actual.id).subscribe((data) => {
                expected = data;
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            expect(expected.name).toContain('SuperDude');
            httpTestingController.verify();
        });


        it('should call message service when error occurs', () => {
            // arrange           
            let expected = { id: 4, name: 'SuperDude', strength: 100 } as Hero

            // act
            heroService.deleteHero(expected).subscribe();

            // assert
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush("Something went wrong", {
                status: 404,
                statusText: "Network error" 
            });

            expect(mockMessageService.add).toHaveBeenCalled();
        });
    });

    describe('getHeroNo404', () => {
        it('should call get with the correct URL', () => {
            // arrange
            let expected = { id: 4, name: 'SuperDude', strength: 100 } as Hero

            // act
            heroService.getHeroNo404(1).subscribe((data) => {
                //    console.log('getHeroNo404: ', data);
                expect(data).toEqual(expected);
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes/?id=1');
            req.flush([{ id: 4, name: 'SuperDude', strength: 100 }]);
            httpTestingController.verify();
        });

        it('should return undefined if not found', () => {
            // arrange
            

            // act
            heroService.getHeroNo404(1).subscribe((data) => {
                expect(data).toEqual(undefined);
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes/?id=1');
            req.flush({});
            httpTestingController.verify();
        });
    });

    describe('updateHero', () => {
        it('should call get with the correct URL', () => {
            // arrange
            let actual = { id: undefined, name: 'SuperDude', strength: 100 } as Hero
            let expected = { id: 4, name: 'SuperDude', strength: 100 } as Hero

            // act
            heroService.updateHero(actual).subscribe((data) => {
                expect(data).toEqual(expected);
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            httpTestingController.verify();
        });

        it('should throw', () => {
            // arrange           
            let error: string;

            // act
            heroService.updateHero(null).subscribe(null, e => {
                error = e;
                console.log(e);
            });

            // assert
            const req = httpTestingController.expectOne('api/heroes');
            req.flush("Something went wrong", {
                status: 404,
                statusText: "Network error"
            });

            expect(error.indexOf("Error updating Hero") >= 0).toBeTruthy();
            httpTestingController.verify();
        });
    });
})