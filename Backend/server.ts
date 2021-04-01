import App from './app';
import UserController from './src/controllers/user/usercontroller';
import LoginController from './src/controllers/login/login';

const app = new App(
    [
        new UserController(),
        new LoginController()
    ]
);
app.listen();


