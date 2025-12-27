import { Routes } from "@angular/router";
import { CoursesPage } from "./courses.page";

export const COURSE_ROUTES: Routes = [
    {
        path: '',
        component: CoursesPage,
        children: []
    }
];

