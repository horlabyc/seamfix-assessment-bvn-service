import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'jest-extended';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  let saveRequestSpy;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    saveRequestSpy = jest.spyOn(appService, 'saveRequest');
  });

  describe('validateBvn', () => {
    describe('Valid BVN in request payload', () => {
      it('should return an object with valid response', async () => {
        const body = { bvn: '11223344556' };
        // const spy = jest.spyOn(appService, 'saveRequest');
        const startTime = new Date().getTime();
        const response = await appController.validateBvn(body);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        expect(response).toHaveProperty('Message', 'Success');
        expect(response).toHaveProperty('Code', '00');
        expect(response).toHaveProperty('Bvn', body.bvn);
        expect(response.ImageDetail).not.toBeNull();
        expect(response.ImageDetail).not.toBe('');
        expect(response.BasicDetail).not.toBeNull();
        expect(response.BasicDetail).not.toBe('');
        expect(elapsedTime).toBeLessThan(5);
        expect(saveRequestSpy).toHaveBeenCalled();
      });

      it('should return a valid base64 encoded image', async () => {
        const body = { bvn: '11223344556' };
        const startTime = new Date().getTime();
        const response = await appController.validateBvn(body);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        expect(response.BasicDetail).toMatch(
          /^(data:image\/([A-Za-z]{3,});base64),(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}={2})$/,
        );
        expect(elapsedTime).toBeLessThan(5);
        expect(saveRequestSpy).toHaveBeenCalled();
      });
    });

    describe('Empty BVN in request payload', () => {
      it('should return error response when request payload is has empty BVN', async () => {
        const body = {};
        const startTime = new Date().getTime();
        const response = await appController.validateBvn(body);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        expect(response).toHaveProperty(
          'Message',
          'One or more of your request parameters failed validation. Please retry',
        );
        expect(response).toHaveProperty('Code', '400');
        expect(elapsedTime).toBeLessThan(1);
        expect(saveRequestSpy).toHaveBeenCalled();
      });
    });

    describe('Invalid BVN in request payload', () => {
      it('should return error response for invalid bvn', async () => {
        const body = {
          bvn: '11223344557',
        };
        const startTime = new Date().getTime();
        const response = await appController.validateBvn(body);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        expect(response).toHaveProperty(
          'Message',
          'The searched BVN does not exist',
        );
        expect(response).toHaveProperty('Code', '01');
        expect(elapsedTime).toBeLessThan(1);
        expect(saveRequestSpy).toHaveBeenCalled();
      });
    });

    describe('Invalid BVN (Less than 11 BVN digits) in request payload', () => {
      it('should return error response for invalid bvn with less than 11 digits', async () => {
        const body = {
          bvn: '1122334',
        };
        const startTime = new Date().getTime();
        const response = await appController.validateBvn(body);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        expect(response).toHaveProperty(
          'Message',
          'The searched BVN is invalid',
        );
        expect(response).toHaveProperty('Code', '02');
        expect(elapsedTime).toBeLessThan(1);
        expect(saveRequestSpy).toHaveBeenCalled();
      });
    });

    describe('Invalid BVN (Contains non digits) in request payload', () => {
      it('should return error response for invalid bvn with non digits characters', async () => {
        const body = {
          bvn: '112233455@',
        };
        const startTime = new Date().getTime();
        const response = await appController.validateBvn(body);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        expect(response).toHaveProperty(
          'Message',
          'The searched BVN is invalid',
        );
        expect(response).toHaveProperty('Code', '02');
        expect(elapsedTime).toBeLessThan(1);
        expect(saveRequestSpy).toHaveBeenCalled();
      });
    });
  });
});
