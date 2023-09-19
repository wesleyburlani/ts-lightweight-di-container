import 'express-async-errors';
import express, { Router } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import health from './controllers/health';
import service from './controllers/service';
import onError from './middlewares/on-error';
import auth from './middlewares/authentication';
import connection from './sockets/connection';

export interface ServerConfig {
    registerRouters?: typeof registerRouters;
    registerSockets?: typeof registerSockets;
}

function registerSockets(server: Server) {
    connection(server);
}

function registerRouters(app: Router) {
    const pub = express.Router();
    pub.use(health);

    const priv = express.Router();
    priv.use(auth);
    priv.use(service);

    app.use(pub);
    app.use(priv);
}

export async function createServer(config?: ServerConfig): Promise<http.Server> {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        path: '/sockets'
    });

    app.set('socket', io);
    app.use(express.json());

    (config?.registerSockets ?? registerSockets)(io);
    (config?.registerRouters ?? registerRouters)(app);

    app.use(onError);
    return server;
}
