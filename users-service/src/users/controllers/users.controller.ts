import { Controller, Post, Body, Inject, HttpStatus, Res } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
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

    @ApiOperation({ summary: 'Login' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string', example: 'john_doe', description: 'Username of the user' },
                password: { type: 'string', example: 'password123', description: 'Password of the user' }
            }
        }
    })
    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res() res
    ) {
        try {
            const user = await this.usersService.login(username, password);
            return res.status(HttpStatus.OK).json({
                message: 'Login successful',
                data: user,
                statusCode: HttpStatus.OK
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid credentials',
                error: error.message,
            });
        }
    }

    @ApiOperation({ summary: 'Signup' })
    @Post('signup')
    async signup(
        @Body() createUserDto: CreateUserDto,
        @Res() res
    ) {
        try {
            const newUser = await this.usersService.sighUp(createUserDto);
            return res.status(HttpStatus.OK).json({
                message: 'User created successfully',
                data: newUser,
                statusCode: HttpStatus.OK
            });
        } catch (error) {
            console.error('Signup error:', error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'User creation failed',
                error: error.message,
            });
        }
    }
}
