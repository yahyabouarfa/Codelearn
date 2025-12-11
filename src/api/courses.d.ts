import type { CourseDetailDto, CourseSummaryDto, ModuleProgressDto, PageResponse, SupportAccessDto } from "../types/api";
export interface CourseSearchParams {
    query?: string;
    page?: number;
    size?: number;
    sort?: string;
}
export declare const fetchCourses: (params?: CourseSearchParams) => Promise<PageResponse<CourseSummaryDto>>;
export declare const fetchCourseDetails: (courseId: number) => Promise<CourseDetailDto>;
export declare const requestSupportAccess: (supportId: number) => Promise<SupportAccessDto>;
export declare const completeModule: (courseId: number, moduleId: number) => Promise<ModuleProgressDto>;
