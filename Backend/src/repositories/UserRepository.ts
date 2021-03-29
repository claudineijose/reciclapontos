import loadSqlQueries from '../infra/loadSql';
import SqlConn from '../infra/database';
import sql from 'mssql';
import { User, AddressUser, AuthTypeUser } from '../models/user/User';

export class UserRepository {
    private folderName = "user";
    private addUser = "addUser";
    private addAuthType = "addAuthType";
    private addAddress = "addAddress";
    private delAuthType = "delAuthType";
    private delAddress = "delAddress";
    private delUser = "delUser";
    private getUserByEmail = "getUserByEmail";
    private getUserByCpf = "getUserByCpf";
    private updateUser = "updateUser";
    private getUserById = "getUserById";
      
    private async getRequest(): Promise<any> {
        const con = await SqlConn.getConn();
        const request = await con.request();
        return request;
    }

    private Fill(dataUser: any): User {
        const { Id, Name, Cpf, Email, UpdateDate, AuthType, Password } = dataUser[0];

        let authType = new AuthTypeUser();
        authType.Type = AuthType;
        authType.Password = Password;

        let addresses = Array<AddressUser>();
        for (let index = 0; index < dataUser.length; index++) {
            const element = dataUser[index];
            const { AddressType, Zip, Address, Complement, City, State, Reference } = element;
            let address = new AddressUser();
            address.Type = AddressType;
            address.Zip = Zip;
            address.Address = Address;
            address.Complement = Complement;
            address.City = City;
            address.State = State;
            address.Reference = Reference;
            addresses.push(address);
        }

        return new User(Id, Name, Cpf, Email, UpdateDate, authType, addresses);
    }

    private async CreateUpdateUser(user: User, update: Boolean): Promise<number | null> {
        const con = await SqlConn.getConn();
        const transaction = new sql.Transaction(con);
        try {
            let id = user.Id;
            let query: any;
            await transaction.begin();
            let reqAdd = new sql.Request(transaction)
            if (update) {
                query = await loadSqlQueries(this.folderName, this.updateUser);
                reqAdd.input("Id", sql.Int, id);
            }
            else {
                query = await loadSqlQueries(this.folderName, this.addUser);
            }
            reqAdd.input("Name", sql.VarChar(50), user.Name);
            reqAdd.input("Cpf", sql.VarChar(100), user.Cpf);
            reqAdd.input("Email", sql.VarChar(100), user.Email);
            var ret = await reqAdd.query(query);
            id = ret.recordset[0].ID;

            let reqDelAuth = new sql.Request(transaction);
            reqDelAuth.input("UserId", sql.Int, id);
            query = await loadSqlQueries(this.folderName, this.delAuthType);
            await reqDelAuth.query(query);

            let reqDelAddress = new sql.Request(transaction);
            reqDelAddress.input("UserId", sql.Int, id);
            query = await loadSqlQueries(this.folderName, this.delAddress);
            await reqDelAddress.query(query);

            let reqAddAuth = new sql.Request(transaction);
            reqAddAuth.input("UserId", sql.Int, id);
            reqAddAuth.input("Type", sql.VarChar(1), user.AuthType.Type);
            reqAddAuth.input("Password", sql.VarChar(1000), user.AuthType.Password);
            query = await loadSqlQueries(this.folderName, this.addAuthType);
            await reqAddAuth.query(query);

            query = await loadSqlQueries(this.folderName, this.addAddress);
            for (let index = 0; index < user.Addresses.length; index++) {
                const element = user.Addresses[index];
                let reqAddress = new sql.Request(transaction);
                reqAddress.input("UserId", sql.Int, id);
                reqAddress.input("Type", sql.VarChar(1), element.Type);
                reqAddress.input("Zip", sql.VarChar(9), element.Zip);
                reqAddress.input("Address", sql.VarChar(50), element.Address);
                reqAddress.input("Complement", sql.VarChar(100), element.Complement);
                reqAddress.input("City", sql.VarChar(50), element.City);
                reqAddress.input("State", sql.VarChar(2), element.State);
                reqAddress.input("Reference", sql.VarChar(1000), element.Reference);
                await reqAddress.query(query);
            }
            transaction.commit();
            return id;
        }
        catch (err) {
            transaction.rollback();
            throw new Error(err.message);
        }

    }

    async create(user: User): Promise<number | null> {
        return this.CreateUpdateUser(user, false);
    }

    async update(user: User): Promise<number | null> {
        return this.CreateUpdateUser(user, true);
    }

    async delete(id: number) {
        const con = await SqlConn.getConn();
        const transaction = new sql.Transaction(con);
        try {
            await transaction.begin();
            let query: any;
            let reqDelAuth = new sql.Request(transaction);
            reqDelAuth.input("UserId", sql.Int, id);
            query = await loadSqlQueries(this.folderName, this.delAuthType);
            await reqDelAuth.query(query);

            let reqDelAddress = new sql.Request(transaction);
            reqDelAddress.input("UserId", sql.Int, id);
            query = await loadSqlQueries(this.folderName, this.delAddress);
            await reqDelAddress.query(query);

            let reqDelUser = new sql.Request(transaction);
            reqDelUser.input("Id", sql.Int, id);
            query = await loadSqlQueries(this.folderName, this.delUser);
            await reqDelUser.query(query);

            transaction.commit();
            return id;
        }
        catch (err) {
            transaction.rollback();
            throw new Error(err.message);
        }
    }
    async getByEmail(email: string): Promise<User | null> {
        const request = await this.getRequest();
        request.input("Email", sql.VarChar(100), email);
        var query: any = await loadSqlQueries(this.folderName, this.getUserByEmail);
        var ret = await request.query(query);
        if (ret.recordsets[0].length > 0)
            return this.Fill(ret.recordset);
        return null;
    }

    async getByCpf(cpf: string): Promise<User | null> {
        const request = await this.getRequest();
        request.input("Cpf", sql.VarChar(14), cpf);
        var query: any = await loadSqlQueries(this.folderName, this.getUserByCpf);
        var ret = await request.query(query);
        if (ret.recordsets[0].length > 0)
            return this.Fill(ret.recordset);
        return null;
    }

    async getById(id: number): Promise<User | null> {
        const request = await this.getRequest();
        request.input("Id", sql.Int, id);
        var query: any = await loadSqlQueries(this.folderName, this.getUserById);
        var ret = await request.query(query);
        if (ret.recordsets[0].length > 0)
            return this.Fill(ret.recordset);
        return null;
    }
}