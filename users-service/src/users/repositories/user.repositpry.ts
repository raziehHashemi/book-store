import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { CreateUserDto } from "../dtos/create-user.dto";
import { MEMBERSHIP_TYPE } from "../enums/membership.enum";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            if (!createUserDto.membershipType) createUserDto.membershipType = MEMBERSHIP_TYPE.REGULAR;
            createUserDto.password = this.hashPassword(createUserDto.password);
            const newUser = new this.userModel(createUserDto);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    async findById(userId: string): Promise<User> {
        try {
            const user = await this.userModel.findById(userId);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async findByUsername(username: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ username });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel.find().exec();
        } catch (error) {
            throw error;
        }
    }

    async update(userId: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
        try {
            const user = await this.findById(userId);
            Object.assign(user, updateUserDto);
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    private hashPassword(password: string): string {
        try {
            const salt = bcrypt.genSaltSync();
            return bcrypt.hashSync(password, salt);
        } catch (error) {
            throw error;
        }
    }
}