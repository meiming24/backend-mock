import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {setupMiddleware} from './app.middleware';
import {setupSwagger} from './swagger'


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.NESTJS_PORT;
    const nodeEnv = process.env.NODE_ENV

    app.setGlobalPrefix('api/v1');
    setupMiddleware(app)
    if (nodeEnv !== 'production') {
        setupSwagger(app);
    }
    await app.listen(port);
}

bootstrap();
