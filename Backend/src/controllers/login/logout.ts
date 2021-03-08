import * as express from 'express';
import Controller from '../../models/Controller';

class LogoutController implements Controller {
    public path = '/logout';
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

export default LogoutController;