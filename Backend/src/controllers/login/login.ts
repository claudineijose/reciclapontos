import * as express from 'express';
import Controller from '../../models/Controller';

class LoginController implements Controller {
    public path = '/login';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path, this.post);
    }

    post = async (req: express.Request, res: express.Response) => {
        
    }
}

export default LoginController;