import loadSqlQueries from '../infra/loadSql';
import SqlConn from '../infra/database';
import sql from 'mssql';
import { User, AddressUser, AuthTypeUser } from '../models/user/User';

export class UserRepository {
    private folderName = "user";
    private addUser = "adduser";
    private addAuthType = "addauthtype";
    private addAddress = "addaddress";
    private delAuthType = "delauthtype";
    private delAddress = "deladdress";
    private delUser = "deluser";
    private getUserByEmail = "getuserbyemail";
    private getUserByCpf = "getuserbycpf";
    private updUser = "upduser";
    private getUserById = "getuserbyid";
    private updPassword = "updpassword";
    private updAddress = "updaddress";
    private getAddressByUser = "getaddressbyuserid";

    private async getRequest(): Promise<any> {
        const con = await SqlConn.getConn();
        const request = await con.request();
        return request;
    }

    private Fill(dataUser: any): User {
        const { Id, Name, Cpf, RG, Bithday, Mobile, Phone, Email, UpdateDate, } = dataUser.recordset[0];

        let authType = new Array<AuthTypeUser>();
        for (let index = 0; index < dataUser.recordsets[1].length; index++) {
            const element = dataUser.recordsets[1][index];

            const { AuthType, Password } = element;

            let auth = new AuthTypeUser();
            auth.Password = Password;
            auth.Type = AuthType;

            authType.push(auth);
        }

        let addresses = Array<AddressUser>();
        for (let index = 0; index < dataUser.recordsets[2].length; index++) {
            const element = dataUser.recordsets[2][index];
            const { Id, AddressType, Zip, Address, Number, Complement, District, City, State, Reference } = element;
            let address = new AddressUser();
            address.Id = Id;
            address.Type = AddressType;
            address.Zip = Zip;
            address.Address = Address;
            address.Number = Number;
            address.Complement = Complement;
            address.District = District;
            address.City = City;
            address.State = State;
            address.Reference = Reference;
            addresses.push(address);
        }

        return new User(Id, Name, Cpf, RG, Bithday, Mobile, Phone, Email, UpdateDate, authType, addresses);
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
                query = await loadSqlQueries(this.folderName, this.updUser);
                reqAdd.input("Id", sql.Int, id);
            }
            else {
                query = await loadSqlQueries(this.folderName, this.addUser);
            }
            reqAdd.input("Name", sql.VarChar(50), user.Name);
            reqAdd.input("Cpf", sql.VarChar(100), user.Cpf);
            reqAdd.input("Email", sql.VarChar(100), user.Email);
            reqAdd.input("RG", sql.VarChar(14), user.Rg);
            reqAdd.input("Birthday", sql.DateTime, user.Birthday);
            reqAdd.input("Mobile", sql.VarChar(14), user.Mobile);
            reqAdd.input("Phone", sql.VarChar(14), user.Phone);
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

            query = await loadSqlQueries(this.folderName, this.addAuthType);
            for (let index = 0; index < user.AuthType.length; index++) {
                const element = user.AuthType[index];
                let reqAddAuth = new sql.Request(transaction);
                reqAddAuth.input("UserId", sql.Int, id);
                reqAddAuth.input("Type", sql.VarChar(1), element.Type);
                reqAddAuth.input("Password", sql.VarChar(1000), element.Password);
                await reqAddAuth.query(query);
            }

            query = await loadSqlQueries(this.folderName, this.addAddress);
            for (let index = 0; index < user.Addresses.length; index++) {
                const element = user.Addresses[index];
                let reqAddress = new sql.Request(transaction);
                reqAddress.input("UserId", sql.Int, id);
                reqAddress.input("Type", sql.VarChar(1), element.Type);
                reqAddress.input("Zip", sql.VarChar(9), element.Zip);
                reqAddress.input("Address", sql.VarChar(50), element.Address);
                reqAddress.input("Number", sql.VarChar(8), element.Number);
                reqAddress.input("Complement", sql.VarChar(100), element.Complement);
                reqAddress.input("District", sql.VarChar(30), element.District);
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
            return this.Fill(ret);
        return null;
    }

    async getByCpf(cpf: string): Promise<User | null> {
        const request = await this.getRequest();
        request.input("Cpf", sql.VarChar(14), cpf);
        var query: any = await loadSqlQueries(this.folderName, this.getUserByCpf);
        var ret = await request.query(query);
        if (ret.recordsets[0].length > 0)
            return this.Fill(ret);
        return null;
    }

    async getById(id: number): Promise<User | null> {
        const request = await this.getRequest();
        request.input("Id", sql.Int, id);
        var query: any = await loadSqlQueries(this.folderName, this.getUserById);
        var ret = await request.query(query);
        if (ret.recordsets[0].length > 0)
            return this.Fill(ret);
        return null;
    }

    async getAddressByUserId(id: number): Promise<Array<AddressUser> | null> {
        const request = await this.getRequest();
        request.input("Id", sql.Int, id);
        var query: any = await loadSqlQueries(this.folderName, this.getAddressByUser);
        var ret = await request.query(query);
        if (ret.recordsets[0].length > 0) {
            let addresses = Array<AddressUser>();
            for (let index = 0; index < ret.recordsets[0].length; index++) {
                const element = ret.recordsets[0][index];
                const { Id, AddressType, Zip, Address, Number, Complement, District, City, State, Reference } = element;
                let address = new AddressUser();
                address.Id = Id;
                address.Type = AddressType;
                address.Zip = Zip;
                address.Address = Address;
                address.Number = Number;
                address.Complement = Complement;
                address.District = District;
                address.City = City;
                address.State = State;
                address.Reference = Reference;
                addresses.push(address);
            }
            return addresses;
        }
        return null;
    }

    async updateAuthType(id: number, auth: Array<AuthTypeUser>): Promise<boolean | null> {
        const con = await SqlConn.getConn();
        const transaction = new sql.Transaction(con);
        try {
            let query: any;
            await transaction.begin();

            let reqDelAuth = new sql.Request(transaction);
            reqDelAuth.input("UserId", sql.Int, id);
            query = await loadSqlQueries(this.folderName, this.delAuthType);
            await reqDelAuth.query(query);

            query = await loadSqlQueries(this.folderName, this.addAuthType);
            for (let index = 0; index < auth.length; index++) {
                const element = auth[index];
                let reqAddAuth = new sql.Request(transaction);
                reqAddAuth.input("UserId", sql.Int, id);
                reqAddAuth.input("Type", sql.VarChar(1), element.Type);
                reqAddAuth.input("Password", sql.VarChar(1000), element.Password);
                await reqAddAuth.query(query);
            }
            transaction.commit();
            return true;
        }
        catch (err) {
            transaction.rollback();
            throw new Error(err.message);
        }
    }

    async updatePassword(id: number, password: string): Promise<boolean | null> {
        const con = await SqlConn.getConn();
        try {
            let req = new sql.Request(con);
            let query = await loadSqlQueries(this.folderName, this.updPassword);

            req.input("UserId", sql.Int, id);
            req.input("Password", sql.VarChar(1000), password);
            await req.query(query);
            return true;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }

    async updateAddress(address: AddressUser): Promise<boolean | null> {
        const con = await SqlConn.getConn();
        try {
            let query = await loadSqlQueries(this.folderName, this.updAddress);

            let reqAddress = new sql.Request(con);
            reqAddress.input("Type", sql.VarChar(1), address.Type);
            reqAddress.input("Zip", sql.VarChar(9), address.Zip);
            reqAddress.input("Address", sql.VarChar(50), address.Address);
            reqAddress.input("Number", sql.VarChar(8), address.Number);
            reqAddress.input("Complement", sql.VarChar(100), address.Complement);
            reqAddress.input("District", sql.VarChar(30), address.District);
            reqAddress.input("City", sql.VarChar(50), address.City);
            reqAddress.input("State", sql.VarChar(2), address.State);
            reqAddress.input("Reference", sql.VarChar(1000), address.Reference);
            reqAddress.input("Id", sql.Int, address.Id);
            await reqAddress.query(query);
            return true;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
}