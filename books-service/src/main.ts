import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT || 3000;

	// RabbitMQ microservice configuration
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABIT_URL],
			queue: 'books_queue',
			queueOptions: {
				durable: true,
			},
		},
	});

	const options = new DocumentBuilder()
		.setTitle('Book Service APIs')
		.setDescription(`Book Service APIs`)
		.setVersion('1.0.0')
		.addServer(process.env.SWAGGER_SERVER, process.env.SWAGGER_ENV)
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('open-apis', app, document, {
		swaggerOptions: {
			persistAuthorization: false,
		}
	});


	await app.startAllMicroservices();
	await app.listen(port);
	console.log('server is running on port : ');

}

bootstrap();