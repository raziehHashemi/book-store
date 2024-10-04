import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repositpry';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			inject: [ConfigService],
			global: false,
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('SECRET_KEY'),
				signOptions: {
					expiresIn: configService.get('JWT_EXPIRATION_TIME'),
				},
			}),
		}),
	],
	controllers: [UsersController],
	providers: [
		{
			provide: 'UsersService',
			useClass: UsersService
		},
		{
			provide: 'UserRepositoryService',
			useClass: UserRepository
		}
	],
	exports: ['UsersService'],
})
export class UsersModule { }
