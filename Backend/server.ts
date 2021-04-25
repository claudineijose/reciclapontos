import App from './app';
import { OAuthController } from './src/controllers/oauth/oauthcontroller';
import UserController from './src/controllers/user/usercontroller';
// import LoginController from './src/controllers/login/logincontroller';

const app = new App(
    [
        new UserController(),
        new OAuthController()
    ]
);
app.listen();


