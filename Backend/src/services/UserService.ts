import { AUTHTYPE, User } from '../models/user/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';

export class UserService {
    async create(user: User): Promise<number | null> {
        if (user.AuthType.Type == AUTHTYPE.PASSWORD) {
            const passwordHash = bcrypt.hashSync(user.AuthType.Password, 10);
            user.AuthType.Password = passwordHash;
        }
        else {
            user.AuthType.Password = "";
        }
        
        return await new UserRepository().create(user);
    }

    async update(user: User): Promise<number | null> {
        if (user.AuthType.Type == AUTHTYPE.PASSWORD) {
            const passwordHash = bcrypt.hashSync(user.AuthType.Password, 10);
            user.AuthType.Password = passwordHash;
        }
        else {
            user.AuthType.Password = "";
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
}
