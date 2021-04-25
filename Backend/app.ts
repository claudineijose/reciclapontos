import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express from 'express';
import Controller from './src/infra/controller';
import "reflect-metadata";
import passport from 'passport';
import cookieParser from "cookie-parser";
import { OAuth } from "./src/infra/oauth";
import logger from "./src/infra/logger"
import morganMiddleware from "./src/infra/morgan";


class App {
    public app: express.Application;
    public port: string;

    constructor(controllers: Array<Controller>) {
        dotenv.config();

        this.port = process.env.PORT || "3000";
        this.app = express();
        /*SETA A PORTA DA API*/
        this.app.set('port', this.port);
        /*INICIALIZA OS MIDDLEWARES*/
        this.initializeMiddlewares();
        /*CARREGA AS ROTAS DAS CONTROLLERS*/
        this.initializeControllers(controllers);

        this.app.use((error: any, req: any, res: any, next: any) => {
            logger.error(error.message)
            res.status(500).send({ type: error.name, message: error.message });
        })
    }

    private initializeMiddlewares() {
        this.app.use(helmet());
        this.app.use(cors());
        // Required for POST requests
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morganMiddleware)

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((obj: any, done) => {
            done(null, obj);
        });

        this.app.use(cookieParser());
        passport.use(OAuth.Local());
        passport.use(OAuth.JWT());
        passport.use("facebookToken", OAuth.Facebook());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((c) => {
            this.app.use('/', c.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.debug(`App listening on the port ${this.port}`);
        });
    }
}
export default App;