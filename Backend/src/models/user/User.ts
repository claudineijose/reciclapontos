export enum AUTHTYPE {
    PASSWORD = "P",
    FACEBOOK = "F",
    GOOGLE = "G"
}

export enum ADDRESSTYPE {
    RESIDENTIAL = "R",
    COMMERCIAL = "C",
    OTHERS = "O"
}
export class AuthTypeUser {
    Type: AUTHTYPE;
    Password: string;

    constructor(type?: AUTHTYPE, password?: string) {
        this.Password = password || "";
        this.Type = type || AUTHTYPE.PASSWORD;
    }
}

export class AddressUser {
    Type: ADDRESSTYPE;
    Zip: string;
    Address: string;
    Complement: string;
    City: string;
    State: string;
    Reference: string;

    constructor(type?: ADDRESSTYPE, zip?: string, address?: string, complement?: string, city?: string, state?: string, reference?: string) {
        this.Type = type || ADDRESSTYPE.RESIDENTIAL;
        this.Zip = zip || "";
        this.Address = address || "";
        this.Complement = complement || "";
        this.City = city || "";
        this.State = state || "";
        this.Reference = reference || "";
    }
}
export class User {
    Id: number;
    Name: string;
    Cpf: string;
    Email: string;
    UpdateDate: Date;
    AuthType: AuthTypeUser;
    Addresses: Array<AddressUser>;
    

    constructor(id?: number, name?: string, cpf?:string, email?: string, updateDate?: Date,
        authType?: AuthTypeUser, addresses?: Array<AddressUser>) {
        this.Id = id || 0;
        this.Name = name || "";
        this.Cpf = cpf || "";
        this.Email = email || "";
        this.UpdateDate = updateDate || new Date();
        this.AuthType = authType || new AuthTypeUser();
        this.Addresses = addresses || new Array<AddressUser>();
    }
}