import * as express from 'express';
import Controller from '../../models/Controller';
import bodyParser from 'body-parser';
import User from '../../models/user/User'


class UserController implements Controller {
    public path = '/user';
    public router = express.Router();
    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path, this.create)
        this.router.put(this.path, this.update);
        this.router.delete(this.path, this.delete);
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}:id`, this.getId);
    }

    create = (req: express.Request, res: express.Response) => {

    }

    update = (req: express.Request, res: express.Response) => {


    }
    delete = (req: express.Request, res: express.Response) => {

    }
    getId = (req: express.Request, res: express.Response) => {

    }
    getAll = (req: express.Request, res: express.Response) => {

    }
}

export default UserController;