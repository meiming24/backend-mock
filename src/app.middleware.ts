import {json} from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import {APIExceptionFilter, DatabaseExceptionFilter} from "./common";

export function setupMiddleware(app: INestApplication) {
    app.enableCors();
    app.use(cookieParser());
    app.use(json({limit: '20mb'}));
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new APIExceptionFilter());
    app.useGlobalFilters(new DatabaseExceptionFilter());

}
