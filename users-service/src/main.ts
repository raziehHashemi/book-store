import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

	await app.startAllMicroservices();
	await app.listen(port);
	console.log('server is running on port : ');

}

bootstrap();