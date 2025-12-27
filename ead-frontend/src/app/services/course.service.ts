import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  modulesCount: number;
  imageUrl: string;
  rating: number;
  studentsCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  public getMockCourses(count: number = 10): Observable<Course[]> {
    const courses: Course[] = Array.from({ length: count }, (_, index) => ({
      id: (index + 1).toString(),
      title: `Course Title ${index + 1}`,
      description: `This is a comprehensive course description for course ${index + 1}. Learn everything you need to know about this topic.`,
      instructor: `Instructor ${index + 1}`,
      duration: `${Math.floor(Math.random() * 20) + 2}h`,
      modulesCount: Math.floor(Math.random() * 10) + 5,
      imageUrl: `https://picsum.photos/seed/${index + 1}/400/250`,
      rating: +(Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
      studentsCount: Math.floor(Math.random() * 1000) + 100
    }));

    return of(courses);
  }
}
