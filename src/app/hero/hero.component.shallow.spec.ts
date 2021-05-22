import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

describe('HeroComponent (shallow tests', () => {
    let fixture: ComponentFixture<HeroComponent>
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 4};

        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    it('should render the hero name', () => {
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 4};
        fixture.detectChanges();

        let deA = fixture.debugElement.query(By.css('a'));
        expect(deA.nativeElement.textContent).toContain('SuperDude');
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    });

    it('should emit when delete called', () => {
        spyOn(fixture.componentInstance.delete, 'emit');

        const nativeElement = fixture.nativeElement;
        const button = nativeElement.querySelector('button');
        button.dispatchEvent(new Event('click'));

        expect(fixture.componentInstance.delete.emit).toHaveBeenCalled();

    });
});
