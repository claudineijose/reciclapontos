import * as express from 'express';
import Controller from '../../infra/controller';
import { body, check, validationResult } from 'express-validator';
import { ADDRESSTYPE, AddressUser, AUTHTYPE, AuthTypeUser, User } from '../../models/user/User';
import { UserService } from '../../services/UserService';

class UserController implements Controller {
    public path = '/user';
    public router = express.Router();

    validacoes = [
        body('name')
            .isLength({ min: 3 })
            .withMessage('O nome é de preenchimento obrigatório'),
        body('cpf')
            .isLength({ min: 11 })
            .withMessage('Cpf é de preenchimento obrigatório'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('E-mail inválido'),
        body('authType.type')
            .isIn(['P', 'F', 'G'])
            .withMessage('Tipo de autenticação deve ser P - Password, F - Facebook, G - Google')
    ];

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(
            this.path,
            this.validacoes
            , this.create);

        this.router.put(
            this.path,
            check('id')
                .isNumeric()
                .withMessage('Id é de preenchimento obrigatório'),
            this.validacoes,
            this.update);

        this.router.delete(`${this.path}/id/:id`,
            check('id')
                .isEmpty()
                .withMessage('Id é de preenchimento obrigatório'),
            this.delete);

        this.router.get(
            `${this.path}/id/:id`,
            this.getId);

        this.router.get(
            `${this.path}/email/:email`,
            check('email')
                .isEmail()
                .withMessage("E-mail inválido"),
            this.getEmail);
    }

    private BodyToUser(body: any): any {
        const { id, name, cpf, email, authType, addresses } = body;
        let auth: AUTHTYPE = authType.type as AUTHTYPE;

        let addr = new Array<AddressUser>();
        for (let index = 0; index < addresses.length; index++) {
            const element = addresses[index];

            const { type, zip, address, complement, city, state, reference } = element;
            let addressType: ADDRESSTYPE = type as ADDRESSTYPE;

            addr.push(new AddressUser(addressType, zip, address, complement, city, state, reference));
        }

        return new User(id, name, cpf, email, undefined, new AuthTypeUser(auth, authType.password), addr);
    }

    create = async (req: express.Request, res: express.Response) => {
        const userEmail = await new UserService().findByEmail(req.body.email);
        if (userEmail) {
            return res.status(500).send({ msg: "E-mail já cadastrado", param: "email", location: "body" });
        }
        const userCpf = await new UserService().findByCpf(req.body.cpf);
        if (userCpf) {
            return res.status(500).send({ msg: "CPF já cadastrado", param: "cpf", location: "body" });
        }
        if (req.body.authType.type == "P" && req.body.authType.password.length < 6) {
            return res.status(500).send({ msg: "Senha deve ter no mínimo 6 caracteres", param: "authType.password", location: "body" });
        }

        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        try {
            let user = this.BodyToUser(req.body);
            new UserService().create(user).
                then((ret) => {
                    res.status(201).send({ message: `Usuário criado com Sucesso. Código: ${ret}` });
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao Incluir. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao Incluir. Mensagem: ${err.message} ${err.stack}`);
        }
    };

    update = async (req: express.Request, res: express.Response) => {
        const userEmail = await new UserService().findByEmail(req.body.email);
        if (userEmail && userEmail.Id != req.body.id) {
            return res.status(500).send({ msg: "E-mail já cadastrado", param: "email", location: "body" });
        }
        const userCpf = await new UserService().findByCpf(req.body.cpf);
        if (userCpf && userCpf.Id != req.body.id) {
            return res.status(500).send({ msg: "CPF já cadastrado", param: "cpf", location: "body" });
        }
        if (req.body.authType.type == "P" && req.body.authType.password.length() < 6) {
            return res.status(500).send({ msg: "Senha deve ter no mínimo 6 caracteres", param: "authType.password", location: "body" });
        }

        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        try {
            let user = this.BodyToUser(req.body);

            new UserService().update(user).
                then((ret) => {
                    res.status(201).send({ message: `Usuário atualizado com Sucesso. Código: ${ret}` });
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao Atualizar. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao Atualizar. Mensagem: ${err.message} ${err.stack}`);
        }
    }

    delete = async (req: express.Request, res: express.Response) => {
        const { id } = req.params;

        new UserService().delete(parseInt(id, 0)).
            then(() => {
                res.status(200).send({ message: `Usuário excluido com Sucesso.` });
            })
    }

    getId = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;
            if (id == undefined || id == null) {
                return res.status(500).send({ msg: "Id é de preenchimento obrigatório ", param: "id", location: "params" });
            }
            new UserService().findById(parseInt(id)).
                then((ret) => {
                    if (ret)
                        res.status(200).send(ret);
                    else {
                        res.status(404).send({ message: "Id não localizado." })
                    }
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao selecionar por E-mail. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao selecionar por E-mail. Mensagem: ${err.message} ${err.stack}`);
        }
    }

    getEmail = async (req: express.Request, res: express.Response) => {
        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        try {
            const { email } = req.params;
            new UserService().findByEmail(email).
                then((ret) => {
                    if (ret)
                        res.status(200).send(ret);
                    else {
                        res.status(404).send({ message: "E-mail não localizado." })
                    }
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao selecionar por E-mail. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao selecionar por E-mail. Mensagem: ${err.message} ${err.stack}`);
        }
    }
}
export default UserController;
