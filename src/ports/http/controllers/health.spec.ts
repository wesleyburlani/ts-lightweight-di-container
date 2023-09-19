import request from 'supertest';
import router from './health';
import { createServer } from '../server';
import { Router } from 'express';

describe('health', () => {
    it('should return 200 OK', async() => {
        const server = await createServer({
            registerRouters(app: Router) { app.use(router) }, 
            registerSockets(server) {},
        });
        const resp = await request(server).get('/health');
        expect(resp.statusCode).toEqual(200);
    });
});