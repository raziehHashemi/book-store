import { Controller, Post, Body, Get, Param, Patch, Inject } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('UsersService') private readonly usersService: UsersService
    ) { }

    @MessagePattern({ cmd: 'find_user_by_id' })
    async findOne(@Payload() userId: string) {
        return await this.usersService.findById(userId);
    }

    @MessagePattern({ cmd: 'find_all_users' })
    async findAll() {
        return await this.usersService.findAll();
    }

    @MessagePattern({ cmd: 'update_user' })
    async update(@Payload() data: { userId: string; updateUserDto: Partial<CreateUserDto> }) {
        const { userId, updateUserDto } = data;
        return await this.usersService.update(userId, updateUserDto);
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string
    ) {
        try {
            return this.usersService.login(username, password);
        } catch (error) {

        }
    }

    @Post('signup')
    async signup(
        @Body() createUserDto: CreateUserDto
    ) {
        try {
            return this.usersService.sighUp(createUserDto);
        } catch (error) {

        }
    }
}
