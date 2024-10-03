import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../schemas/user.schema";

export interface IUserRepository {
    create(createUserDto: CreateUserDto): Promise<User>;
    findById(userId: string): Promise<User>;
    findAll(): Promise<User[]>;
    update(userId: string, updateUserDto: Partial<CreateUserDto>): Promise<User>;
    findByUsername(username: string): Promise<User>
}