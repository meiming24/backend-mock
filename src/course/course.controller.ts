import { compare } from "bcrypt";
import { Response } from 'express';
import * as _ from "lodash";
import {
  Get,
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
  UnauthorizedException,
  BadRequestException,
  Param,
  ParseUUIDPipe,
  Delete,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ErrorResponse } from "src/common/error-response";
import { CourseService } from "./course.service";
import { JWTAuthGuard } from "src/common";


@Controller("auth")
@ApiTags("Authentication")
@ApiResponse({ status: 400, type: ErrorResponse })
@ApiResponse({ status: 500, type: ErrorResponse })
export class AuthController {
  constructor(private readonly courseService: CourseService) {
  }

  @Get("")
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: "Get all courses" })
  async findAll(@Res() response: Response) {
    const result = await this.courseService.getAllCourse();
    if (!result) {
      throw new BadRequestException("Course does not exist.");
    }
    response.status(200).json({ result });
  }


  @Get(":id")
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: "Get course detail" })
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Res() response: Response) {
    const result = await this.courseService.getCourse(id);
    if (!result) {
      throw new BadRequestException("Course does not exist.");
    }
    response.status(200).json({ result });
  }

  @Post("")
  @HttpCode(200)
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Create course" })
  @HttpCode(201)
  async createCourse(@Body() payload: any, @Req() request: any, @Res() response: Response) {
    const course = await this.courseService.createCourse(payload);
    if (!course) {
      throw new BadRequestException("Course does not success.");
    }
    response.status(201).json({ course });
  }

  @Put(":id")
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiOperation({ summary: "Update course detail" })
  async updateCourse(@Param("id", ParseUUIDPipe) id: string, @Res() response: Response) {
    const course = await this.courseService.updateCourse(id);
    if (!course) {
      throw new BadRequestException("Course does not success.");
    }
    response.status(204).json({ course });
  }

  @Delete(":id")
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: "Delete course detail" })
  async deleteCourse(@Param("id", ParseUUIDPipe) id: string, @Res() response: Response) {
    const course = await this.courseService.deleteCourse(id);
    if (!course) {
      throw new BadRequestException("Course does not success.");
    }
    response.status(204).json({ message: 'Deleted' });
  }
}
