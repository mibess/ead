export interface LessonResponse {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
}

export interface LessonRequest {
    title: string;
    description: string;
    videoUrl: string;
}
