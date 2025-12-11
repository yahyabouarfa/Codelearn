import { http } from "./http";
import type {
  CourseDetailDto,
  CourseSummaryDto,
  ModuleProgressDto,
  PageResponse,
  SupportAccessDto
} from "../types/api";

export interface CourseSearchParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const fetchCourses = async (
  params: CourseSearchParams = {}
): Promise<PageResponse<CourseSummaryDto>> => {
  console.log("Fetching courses with params:", params);
  console.log("Base URL:", http.defaults.baseURL);
  try {
    const response = await http.get<PageResponse<CourseSummaryDto>>("/courses", { params });
    console.log("Courses response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch courses error:", error);
    throw error;
  }
};

export const fetchCourseDetails = async (courseId: number): Promise<CourseDetailDto> => {
  const response = await http.get<CourseDetailDto>(`/courses/${courseId}`);
  return response.data;
};

export const requestSupportAccess = async (supportId: number): Promise<SupportAccessDto> => {
  const response = await http.post<SupportAccessDto>(`/supports/${supportId}/access`);
  return response.data;
};

export const completeModule = async (
  courseId: number,
  moduleId: number
): Promise<ModuleProgressDto> => {
  const response = await http.post<ModuleProgressDto>(
    `/courses/${courseId}/modules/${moduleId}/complete`
  );
  return response.data;
};
