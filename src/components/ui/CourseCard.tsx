import { Link } from "react-router-dom";
import type { CourseSummaryDto } from "../../types/api";
import { Badge } from "./Badge";
import { Card } from "./Card";
import Avatar from "./Avatar";

interface CourseCardProps {
  course: CourseSummaryDto;
}

export const CourseCard = ({ course }: CourseCardProps) => (
  <Link to={`/courses/${course.id}`} className="group block h-full">
    <Card 
      variant="gradient" 
      hover 
      className="h-full flex flex-col gap-4 group-hover:border-primary-200 transition-all duration-300"
    >
      {/* Thumbnail Placeholder */}
      <div className="relative -mx-6 -mt-6 mb-2 h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 flex items-center justify-center">
        <div className="text-6xl opacity-20">📚</div>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
      </div>

      {/* Author Badge */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={course.authorName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-600 truncate">
            {course.authorName}
          </p>
        </div>
        <Badge variant="primary" size="sm">
          {course.supportsCount} modules
        </Badge>
      </div>

      {/* Title & Description */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-3">
          {course.description}
        </p>
      </div>

      {/* Footer with CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
          <span>View Course</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        
        {/* Progress Indicator - Placeholder for future */}
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-accent-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </Card>
  </Link>
);
