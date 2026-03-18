import { CourseLevel, CourseStatus } from "../enums/course.enum";

export interface Page<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    }
}

export interface CourseFilter {
    courseLevel?: CourseLevel | string;
    courseStatus?: CourseStatus | string;
    name?: string;
}

export interface PageableOptions {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC' | string;
}

export interface CourseResponse {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    courseStatus: CourseStatus;
    courseLevel: CourseLevel;
    userInstructor: string;
}

export interface CourseRequest {
    name: string;
    description: string;
    imageUrl: string;
    courseStatus: CourseStatus;
    courseLevel: CourseLevel;
    userInstructor: string;
}
