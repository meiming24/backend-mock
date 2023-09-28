import {ApiProperty} from '@nestjs/swagger';

export class ErrorResponse {
    @ApiProperty({type: 'number'})
    statusCode: number;

    @ApiProperty({type: 'string'})
    message: string;

    @ApiProperty({type: 'string', format: 'date-time'})
    timestamp: string;

    @ApiProperty({type: 'string'})
    path: string;

    @ApiProperty({type: 'string'})
    method: string;
}