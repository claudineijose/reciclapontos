import * as express from 'express';

interface Controller {
    path: string;
    router: express.Router;
    intializeRoutes() : void;
}

export default Controller;