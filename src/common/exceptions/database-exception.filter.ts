import {
    Request,
    Response
} from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus
} from "@nestjs/common";

@Catch(PrismaClientKnownRequestError)
export class DatabaseExceptionFilter implements ExceptionFilter {
    catch(error: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error?.code || error.message;
        const payload = {
            statusCode: statusCode,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        }
        response.status(statusCode).json(payload);
    }
}

