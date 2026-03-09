import { CourseLevel, CourseStatus } from "../enums/course.enum";

export interface CourseResponse {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    courseStatus: CourseStatus;
    courseLevel: CourseLevel;
    userInstructor: string;
}