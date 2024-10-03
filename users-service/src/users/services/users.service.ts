import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { IUserRepository } from '../interfaces/user-repository.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MEMBERSHIP_TYPE } from '../enums/membership.enum';


@Injectable()
export class UsersService {
	constructor(
		@Inject('UserRepositoryService') private readonly userRepository: IUserRepository,
		private readonly jwtService: JwtService,
	) { }

	async create(createUserDto: CreateUserDto): Promise<User> {
		try {
			const newUser = await this.userRepository.create(createUserDto);
			return newUser;
		} catch (error) {
			throw error;
		}
	}

	async findById(userId: string): Promise<User> {
		try {
			const user = await this.userRepository.findById(userId);
			if (!user) {
				throw new NotFoundException('User not found');
			}
			return user;
		}
		catch (error) {
			throw error;
		}
	}

	async findByUsername(username: string): Promise<User> {
		try {
			const user = await this.userRepository.findByUsername(username);
			if (!user) {
				throw new NotFoundException('User not found');
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	async findAll(): Promise<User[]> {
		try {
			return await this.userRepository.findAll();
		} catch (error) {
			throw error;
		}
	}

	async update(userId: string, updateUserDto: Partial<CreateUserDto>,): Promise<User> {
		try {
			const updatedUser = await this.userRepository.update(userId, updateUserDto);
			return updatedUser;
		} catch (error) {
			throw error;
		}
	}

	async sighUp(createUserDto: CreateUserDto): Promise<{ accessToken: string; }> {
		try {
			const newUser = await this.create(createUserDto);
			const accessToken = this.jwtPayload(newUser.id, newUser.membershipType);
			return accessToken;
		} catch (error) {
			throw error;
		}
	}

	async login(username: string, password: string): Promise<{ accessToken: string; }> {
		try {
			const user = await this.findByUsername(username);
			if (!user) {
				throw new Error('User not found');
			}
			if (!bcrypt.compareSync(password, user.password)) {
				throw new Error('Invalid credentials');
			}
			const accessToken = this.jwtPayload(user.id, user.membershipType);
			return accessToken;
		} catch (error) {
			throw error;
		}
	}

	private jwtPayload(id: string, membershipType: MEMBERSHIP_TYPE) {
		return {
			accessToken: this.jwtService.sign({ userId: id, membershipType }),
		};
	}
}
