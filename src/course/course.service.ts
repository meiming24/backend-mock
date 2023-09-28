import { Injectable } from "@nestjs/common";
import {
  PrismaService,
} from "src/common";
@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllCourse() {
    return this.prisma.course.findAll({
      select: {
        id: true,
        teacherId: true,
        programId: true,
        name: true,
        required: true,
      }
    })
  }
  
  async getCourse(id: string) {
    return this.prisma.course.findFirst({
      where: { id: id },
      select: {
        id: true,
        teacherId: true,
        programId: true,
        name: true,
        required: true,
      }
    })
  }

  async createCourse(data: any) {
    return this.prisma.course.create({
      data: {
        teacherId: true,
        programId: true,
        name: true,
        required: true,
      }
    })
  }

  async updateCourse(id: string) {
    return this.prisma.course.update({
      where: {
        id: id
      },
      data: {
        teacherId: true,
        programId: true,
        name: true,
        required: true,
      }
    })
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: {
        id: id
      }
    })
  }

}