import {
    Request,
    Response
} from "express";
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException
} from "@nestjs/common";

@Catch(HttpException)
export class APIExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const error = exception?.getResponse();
        const message = error['message'] || exception.message;
        const payload = {
            statusCode: status,
            message: message,
            path: request.url,
            timestamp: new Date().toISOString(),
        }
        response.status(status).json(payload);
    }
}