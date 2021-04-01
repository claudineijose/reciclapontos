import { AddressUser, AUTHTYPE, AuthTypeUser, User } from '../models/user/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';

export class UserService {
    async create(user: User): Promise<number | null> {
        for (let index = 0; index < user.AuthType.length; index++) {
            const element = user.AuthType[index];
            if (element.Type == AUTHTYPE.PASSWORD) {
                const passwordHash = bcrypt.hashSync(element.Password, 10);
                element.Password = passwordHash;
            }
            else {
                element.Password = "";
            }

        }
        return await new UserRepository().create(user);
    }

    async update(user: User): Promise<number | null> {
        for (let index = 0; index < user.AuthType.length; index++) {
            const element = user.AuthType[index];
            if (element.Type == AUTHTYPE.PASSWORD) {
                const passwordHash = bcrypt.hashSync(element.Password, 10);
                element.Password = passwordHash;
            }
            else {
                element.Password = "";
            }

        }
        return await new UserRepository().update(user);
    }

    async delete(id: number) {
        await new UserRepository().delete(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await new UserRepository().getByEmail(email);
    }

    async findById(id: number): Promise<User | null> {
        return await new UserRepository().getById(id);
    }

    async findByCpf(cpf: string): Promise<User | null> {
        return await new UserRepository().getByCpf(cpf);
    }

    async updateAuthType(id: number, auth: Array<AuthTypeUser>): Promise<boolean | null> {
        for (let index = 0; index < auth.length; index++) {
            const element = auth[index];
            if (element.Type == AUTHTYPE.PASSWORD) {
                const passwordHash = bcrypt.hashSync(element.Password, 10);
                element.Password = passwordHash;
            }
            else {
                element.Password = "";
            }

        }
        return await new UserRepository().updateAuthType(id, auth);
    }

    async updatePassword(id: number, password: string): Promise<boolean | null> {
        const passwordHash = bcrypt.hashSync(password, 10);
        return await new UserRepository().updatePassword(id, passwordHash);
    }

    async updateAddress(addresses: AddressUser): Promise<boolean | null> {
        return await new UserRepository().updateAddress(addresses);
    }
    
    async getAddressByUserId(id: number): Promise<Array<AddressUser> | null> {
        return await new UserRepository().getAddressByUserId(id);
    }

}
