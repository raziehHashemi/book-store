import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config'
import { UsersModule } from './users/users.module';


@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get('DB_URI'),
			}),
			inject: [ConfigService],
		}),

		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration]
		}),

	],
	controllers: [],
	providers: [],
})
export class AppModule { }
