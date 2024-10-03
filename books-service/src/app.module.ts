import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config'


@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get('DB_URI'),
			}),
			inject: [ConfigService],
		}),

		BooksModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration]
		}),

	],
	controllers: [],
	providers: [],
})
export class AppModule { }
