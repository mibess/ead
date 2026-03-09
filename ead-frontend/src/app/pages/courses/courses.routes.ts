import { Routes } from "@angular/router";
import { CoursesPage } from "./courses.page";
import { CoursesNewPage } from "./courses-new.page/courses-new.page";

import { CoursesEditPage } from "./courses-edit.page/courses-edit.page";

export const COURSE_ROUTES: Routes = [
    {
        path: '',
        component: CoursesPage,
    },
    {
        path: 'new',
        component: CoursesNewPage
    },
    {
        path: ':id/edit',
        component: CoursesEditPage
    }
];

