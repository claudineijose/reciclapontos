import express from 'express';
import cfg from 'config';
import Controller from '../src/models/Controller';

class App {
    public app: express.Application;
    public port: string;

    constructor(controllers: Array<Controller>) {
        this.port = process.env.PORT || cfg.get('server.port');
        this.app = express();
        /*SETA A PORTA DA API*/
        this.app.set('port', this.port);
        /*INICIALIZA OS MIDDLEWARES*/
        this.initializeMiddlewares();
        /*CARREGA AS ROTAS DAS CONTROLLERS*/
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((c) => {
            this.app.use('/', c.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;

// export default () => {
//     return express()
//         .set('port', process.env.PORT || cfg.get('server.port'))
//         .use(express.json());
// };

