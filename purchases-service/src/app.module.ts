import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config';
import { PurchasesModule } from './purchases/purchases.module';


@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('DB_URI'),
            }),
            inject: [ConfigService],
        }),

        PurchasesModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),

    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
