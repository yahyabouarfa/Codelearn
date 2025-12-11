export type ResourceType = "PDF" | "VIDEO" | "Video";

export interface CourseSummaryDto {
  id: number;
  title: string;
  description: string;
  authorName: string;
  supportsCount: number;
}

export interface ModuleDto {
  id: number;
  title: string;
  type: ResourceType;
  completed: boolean;
  completedAt?: string;
}

export interface SupportDto {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  accessEndpoint: string;
  courseId: number;
}

export interface CourseDetailDto {
  id: number;
  title: string;
  description: string;
  authorName: string;
  modules: ModuleDto[];
  supports: SupportDto[];
}

export interface SupportAccessDto {
  supportId: number;
  type: ResourceType;
  temporaryUrl: string;
  expiresAt: string;
}

export interface ModuleProgressDto {
  courseId: number;
  moduleId: number;
  apprenantId: number;
  completedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
