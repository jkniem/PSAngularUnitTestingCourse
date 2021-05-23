import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MessageService } from "../message.service";
import { MessagesComponent } from "./messages.component";

describe('MessageComponent', () => {
    let target: ComponentFixture<MessagesComponent>;
    let mockService: jasmine.SpyObj<MessageService>;

    beforeEach(() => {
        mockService = jasmine.createSpyObj<MessageService>(['add', 'clear']);

        TestBed.configureTestingModule({
            declarations: [
                MessagesComponent
            ],
            providers: [
                { provide: MessageService, useValue: mockService }
            ]
        });

        target = TestBed.createComponent(MessagesComponent);
    });

    it('should create component with MessageService', () => {
        mockService.messages = [];
        target.detectChanges();
        expect(target.componentInstance).toBeDefined();
    });
});