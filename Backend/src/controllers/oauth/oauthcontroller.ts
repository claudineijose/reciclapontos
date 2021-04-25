import express from "express";
import passport from "passport";
import Controller from "../../infra/controller";
import JWT from "jsonwebtoken";
import { User } from "../../models/user/user";
import logger from "../../infra/logger";

export class OAuthController implements Controller {
    public path = '/oauth'
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes = () => {
        this.router.post(this.path, passport.authenticate('local', { session: false }), this.loginOAuth);
        this.router.post(`${this.path}/facebook`, passport.authenticate('facebookToken', { session: false }), this.facebookOAuth);
    }

    signToken = (user: User) => {
        return JWT.sign({
            iss: "RECICLAPONTOS",
            id: user.Id
        }, process.env.SECRET || "", { expiresIn: 300 })
    }

    loginOAuth = async (req: express.Request, res: express.Response) => {
        let user = req.user as User;
        const token = this.signToken(user);
        res.status(200).json({ sucess: true, token });
    }

    facebookOAuth = async (req: express.Request, res: express.Response) => {
        let user = req.user as User;
        const token = this.signToken(user);
        res.status(200).json({ newUser: req.authInfo || false, sucess: true, token });
    }

    // add this callback for handling errors. Then you can set responses with codes or 
    // redirects as you like.
    erro = (error: any, req: express.Request, res: express.Response, next: any) => {
        if (error) {
            logger.error(error.message);
            res.status(400).json({ success: false, message: 'Auth failed', error })
        }
    }
}