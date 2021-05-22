import { MessageService } from "./message.service"

describe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {

    });

    it('should have no messages to start', () => {
        // arrange
        service = new MessageService();

        // assert
        expect(service.messages.length).toBe(0);
    });

    it('should add messages when called', () => {
        // arrange
        service = new MessageService();
        
        // act
        service.add('foobar');

        // assert
        expect(service.messages.length).toBe(1);
    });

    it('should remove all messages when clear is called', () => {
        // arrange
        service = new MessageService();
        service.add('foobar');
        // console.log('message lenght', service.messages.length)
        
        // act
        service.clear();

        // assert
        // console.log('message lenght', service.messages.length)
        expect(service.messages.length).toBe(0);
    });
})