import * as express from 'express';
import Controller from '../../infra/controller';
class LoginController implements Controller {
    public path = '/login';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path, this.post);
        this.router.get(this.path, this.get);
    }

    public async post(req: express.Request, res: express.Response) {
        res.send(false);
    }

    get = async (req: express.Request, res: express.Response) => {

    }
}

export default LoginController;

