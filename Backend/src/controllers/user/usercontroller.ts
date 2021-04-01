import * as express from 'express';
import Controller from '../../infra/controller';
import { check, param, validationResult } from 'express-validator';
import { ADDRESSTYPE, AddressUser, AUTHTYPE, AuthTypeUser, User } from '../../models/user/User';
import { UserService } from '../../services/UserService';
import { ValidarCpf } from '../../infra/util';

class UserController implements Controller {
    public path = '/user';
    public router = express.Router();

    validacoesId = [
        param('id')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Id é de preenchimento obrigatório')
            .isEmpty()
            .withMessage('Id é de preenchimento obrigatório')
            .toInt()
            .withMessage("Id é do tipo Numérico.")
            .custom(async (id) => {
                const user = await new UserService().findById(parseInt(id));
                if (!user) {
                    return new Promise((_, reject) => {
                        reject("Usuário não localizado");
                    });
                }
            }),
    ]
    validacoesPassWord = [
        check("authType")
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage("Tipo de Autenticação é de preenchimento Obrigatório"),
        check("authType.*.password")
            .custom(async (password, meta) => {
                let index = meta.path.substring(meta.path.indexOf('[') + 1, meta.path.indexOf(']'));
                const { authType } = meta.req.body;
                if (authType[index].type == AUTHTYPE.PASSWORD) {
                    if (!authType[index].password) {
                        return new Promise((_, reject) => {
                            reject("Senha é de preenchimento obrigatório")
                        })
                    }
                    else if (authType[index].password.length < 6) {
                        return new Promise((_, reject) => {
                            reject("Senha deve ter no mínimo 6 caracteres")
                        })
                    }
                }
            }),
        check("authType.*.type")
            .isIn(["P", "F", "G"])
            .withMessage("Tipo de Autenticação Inválido - 'P', 'F' ou 'G'"),
    ]
    validacoes = [
        check('name')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('O nome é de preenchimento obrigatório'),
        check('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('E-mail inválido'),
        check('cpf')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage("CPF é de preenchimento obrigatório")
            .custom(async (cpf) => {
                if (!ValidarCpf.cpf(cpf)) {
                    return new Promise((_, reject) => {
                        reject("CPF inválido");
                    });
                }
            }),
    ];

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(
            this.path,
            this.validacoes,
            this.validacoesPassWord,
            this.create);

        this.router.put(
            this.path,
            check('id')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Id é de preenchimento obrigatório'),
            this.validacoes,
            this.validacoesPassWord,
            this.update);

        this.router.post(`${this.path}/:id/authtype`,
            param('id')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Id é de preenchimento obrigatório')
                .toInt()
                .withMessage('Id não é numérico')
                .custom(async id => {
                    const user = await new UserService().findById(parseInt(id));
                    if (!user) {
                        return new Promise((_, reject) => {
                            reject("Usuário não localizado");
                        });
                    }
                }),
            this.validacoesPassWord,
            this.updateAuthType);

        this.router.put(`${this.path}/:id/password`,
            param('id')
                .isNumeric()
                .withMessage("Id é do tipo Numérico.")
                .custom(async id => {
                    const user = await new UserService().findById(parseInt(id));
                    if (!user) {
                        return new Promise((_, reject) => {
                            reject("Usuário não localizado");
                        });
                    }
                    if (!user.AuthType.find(f => f.Type == AUTHTYPE.PASSWORD)) {
                        return new Promise((_, reject) => {
                            reject("Usuário não possui o Tipo de Autenticação 'P' cadastrado");
                        });
                    }
                }),
            check("password")
                .custom(async (password) => {
                    if (password.length < 6) {
                        return new Promise((_, reject) => {
                            reject("Senha deve ter no mínimo 6 caracteres");
                        });
                    }
                }),
            this.updatePassword);

        this.router.put(`${this.path}/:id/address/:idaddress`,
            param('id')
                .isNumeric()
                .withMessage("Id com valor inválido.")
                .custom(async (id) => {
                    const user = await new UserService().findById(parseInt(id));
                    if (!user) {
                        return new Promise((_, reject) => {
                            reject("Usuário não localizado");
                        });
                    }
                }),
            param('idaddress')
                .isNumeric()
                .withMessage("Id do Endereço é do tipo Numérico.")
                .custom(async (idaddress, meta) => {
                    const { id } = meta.req.params;
                    const user = await new UserService().findById(parseInt(id));
                    if (user && !user.Addresses.find(f => f.Id == parseInt(idaddress))) {
                        return new Promise((_, reject) => {
                            reject("Endereço não localizado");
                        });
                    }
                }),
            check("type")
                .isIn(["O", "C", "R"])
                .withMessage("Tipo de Endereço Inválido - 'O', 'C' ou 'R'"),
            this.updateAddress);

        this.router.delete(`${this.path}/id/:id`,
            param('id')
                .isEmpty()
                .withMessage('Id é de preenchimento obrigatório')
                .toInt()
                .withMessage("Id é do tipo Numérico.")
                .custom(async (id) => {
                    const user = await new UserService().findById(parseInt(id));
                    if (!user) {
                        return new Promise((_, reject) => {
                            reject("Usuário não localizado");
                        });
                    }
                }),
            this.delete);

        this.router.get(
            `${this.path}/id/:id`,
            this.getId);

        this.router.get(
            `${this.path}/email/:email`,
            param('email')
                .isEmail()
                .withMessage("E-mail inválido"),
            this.getEmail);
    }

    private BodyToUser(body: any): any {
        const { id, name, cpf, rg, birthday, mobile, phone, email, authType, addresses } = body;

        let types = new Array<AuthTypeUser>();
        for (let index = 0; index < authType.length; index++) {
            const element = authType[index];
            const { type, password } = element
            let auth: AUTHTYPE = type as AUTHTYPE;

            types.push(new AuthTypeUser(auth, password));
        }

        let addr = new Array<AddressUser>();
        for (let index = 0; index < addresses.length; index++) {
            const element = addresses[index];

            const { type, zip, address, number, complement, district, city, state, reference } = element;
            let addressType: ADDRESSTYPE = type as ADDRESSTYPE;

            addr.push(new AddressUser(addressType, zip, address, number, complement, district, city, state, reference));
        }

        return new User(id, name, cpf, rg, new Date(birthday), mobile, phone, email, undefined, types, addr);
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
        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        const userEmail = await new UserService().findByEmail(req.body.email);
        if (userEmail && userEmail.Id != req.body.id) {
            return res.status(500).send({ msg: "E-mail já cadastrado", param: "email", location: "body" });
        }
        const userCpf = await new UserService().findByCpf(req.body.cpf);
        if (userCpf && userCpf.Id != req.body.id) {
            return res.status(500).send({ msg: "CPF já cadastrado", param: "cpf", location: "body" });
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
        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }

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

    updateAuthType = async (req: express.Request, res: express.Response) => {
        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        try {
            const { id } = req.params;
            const { authType } = req.body;

            let types = new Array<AuthTypeUser>();
            for (let index = 0; index < authType.length; index++) {
                const element = authType[index];
                const { type, password } = element
                let auth: AUTHTYPE = type as AUTHTYPE;

                types.push(new AuthTypeUser(auth, password));
            }
            new UserService().updateAuthType(parseInt(id), types).
                then((ret) => {
                    if (ret)
                        res.status(201).send({ message: `Tipo de Autenticação atualizado com Sucesso. Código: ${id}` });
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao Incluir. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao Incluir. Mensagem: ${err.message} ${err.stack}`);
        }
    }

    updatePassword = async (req: express.Request, res: express.Response) => {
        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        try {
            const { id } = req.params;
            const { password } = req.body;


            new UserService().updatePassword(parseInt(id), password).
                then((ret) => {
                    if (ret)
                        res.status(201).send({ message: `Senha atualizada com Sucesso. Código: ${id}` });
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao atualizar. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao Incluir. Mensagem: ${err.message} ${err.stack}`);
        }
    }

    updateAddress = async (req: express.Request, res: express.Response) => {
        const schemaErrors = validationResult(req);
        if (!schemaErrors.isEmpty()) {
            return res.status(500).send(schemaErrors.array());
        }
        try {
            const { idaddress } = req.params;
            const { type, zip, address, number, complement, district, city, state, reference } = req.body;
            let addressType: ADDRESSTYPE = type as ADDRESSTYPE;
            new UserService().updateAddress(new AddressUser(addressType, zip, address, number, complement, district, city, state, reference, parseInt(idaddress))).
                then((ret) => {
                    if (ret)
                        res.status(201).send({ message: `Endereço atualizado com Sucesso.` });
                }).
                catch((err) => {
                    res.status(500).send(`Falha ao atualizar. Mensagem: ${err.message} ${err.stack}`);
                    console.log(err.message);
                });
        }
        catch (err) {
            res.status(500).send(`Falha ao atualizar. Mensagem: ${err.message} ${err.stack}`);
        }
    }
}
export default UserController;
