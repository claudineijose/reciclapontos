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
    Id: number;
    Type: ADDRESSTYPE;
    Zip: string;
    Address: string;
    Number: string;
    Complement: string;
    District: string;
    City: string;
    State: string;
    Reference: string;

    constructor(type?: ADDRESSTYPE, zip?: string, address?: string, number?: string, complement?: string, district?: string,
        city?: string, state?: string, reference?: string, id?: number) {
        this.Type = type || ADDRESSTYPE.RESIDENTIAL;
        this.Zip = zip || "";
        this.Address = address || "";
        this.Number = number || "";
        this.Complement = complement || "";
        this.District = district || "";
        this.City = city || "";
        this.State = state || "";
        this.Reference = reference || "";
        this.Id = id || 0;
    }
}
export class User {
    Id: number;
    Name: string;
    Cpf: string;
    Rg: string;
    Birthday: Date;
    Mobile: string;
    Phone: string;
    Email: string;
    UpdateDate: Date;
    AuthType: Array<AuthTypeUser>;
    Addresses: Array<AddressUser>;


    constructor(id?: number, name?: string, cpf?: string,
        rg?: string, birthday?: Date, mobile?: string, phone?: string,
        email?: string, updateDate?: Date,
        authType?: Array<AuthTypeUser>,
        addresses?: Array<AddressUser>) {
        this.Id = id || 0;
        this.Name = name || "";
        this.Cpf = cpf || "";
        this.Birthday = birthday || new Date();
        this.Rg = rg || "";
        this.Mobile = mobile || "";
        this.Phone = phone || "";
        this.Email = email || "";
        this.UpdateDate = updateDate || new Date();
        this.AuthType = authType || new Array<AuthTypeUser>();
        this.Addresses = addresses || new Array<AddressUser>();
    }
}