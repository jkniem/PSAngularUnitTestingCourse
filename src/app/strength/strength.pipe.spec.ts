import { StrengthPipe } from "./strength.pipe"

enum Level {
    weak = '(weak)',
    strong = '(strong)',
    unbelievable = '(unbelievable)'
}

describe('StrengthPipe', () => {
    it('should display weak if strength is 5', () => {
        // arrange
        let pipe = new StrengthPipe();
        const actual = 5

        // act
        let result = pipe.transform(actual);

        // assert
        expect(result).toBe(`${actual} ${Level.weak}`);
    })

    it('should display strong if strength is 10', () => {
        // arrange
        let pipe = new StrengthPipe();
        const actual = 10
        // act
        let result = pipe.transform(actual);

        // assert
        expect(result).toBe(`${actual} ${Level.strong}`);
    })

    it('should display unbelievable if strength is over 20', () => {
        // arrange
        let pipe = new StrengthPipe();
        const actual = 44

        // act
        let result = pipe.transform(actual);

        // assert
        expect(result).toBe(`${actual} ${Level.unbelievable}`);
    })
})