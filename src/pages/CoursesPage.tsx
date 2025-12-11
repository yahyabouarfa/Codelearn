import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCourses } from "../api/courses";
import type { CourseSummaryDto, PageResponse } from "../types/api";
import { useDebounce } from "../hooks/useDebounce";
import { SearchInput } from "../components/ui/SearchInput";
import { CourseCard } from "../components/ui/CourseCard";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { SkeletonCard } from "../components/ui/Skeleton";

const PAGE_SIZE = 9;
const SORT_OPTIONS = [
  { value: "relevance", label: "📊 Relevance", icon: "📊" },
  { value: "title,asc", label: "🔤 Title (A–Z)", icon: "🔤" },
  { value: "supportsCount,desc", label: "📚 Most Modules", icon: "📚" },
];

type ViewMode = "grid" | "list";
type FilterOption = "all" | "in-progress" | "completed";

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";
  const initialPage = Number(searchParams.get("page") ?? "0");
  const paramSort = searchParams.get("sort");
  const initialSort = SORT_OPTIONS.some((option) => option.value === paramSort)
    ? (paramSort as string)
    : SORT_OPTIONS[0].value;

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [page, setPage] = useState(initialPage);
  const [sort, setSort] = useState(initialSort);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [data, setData] = useState<PageResponse<CourseSummaryDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache to store fetched data and avoid re-fetching
  const cacheRef = useRef<Map<string, PageResponse<CourseSummaryDto>>>(new Map());

  const totalResults = data?.totalElements ?? 0;

  // Reset to first page when search query or sort changes (but not on initial mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(0);
  }, [debouncedQuery, sort]);

  useEffect(() => {
    let cancelled = false;
    
    const load = async () => {
      // Create cache key based on query parameters
      const cacheKey = JSON.stringify({
        query: debouncedQuery || undefined,
        page,
        size: PAGE_SIZE,
        sort: sort === "relevance" ? undefined : sort
      });

      // Check if data is already in cache
      const cachedData = cacheRef.current.get(cacheKey);
      if (cachedData) {
        console.log('[Cache] Using cached data for:', cacheKey);
        setData(cachedData);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const courses = await fetchCourses({
          query: debouncedQuery || undefined,
          page,
          size: PAGE_SIZE,
          sort: sort === "relevance" ? undefined : sort
        });
        if (cancelled) return;
        
        // Store in cache
        cacheRef.current.set(cacheKey, courses);
        
        setData(courses);
        setSearchParams((params) => {
          const next = new URLSearchParams(params);
          if (debouncedQuery) {
            next.set("query", debouncedQuery);
          } else {
            next.delete("query");
          }
          next.set("page", String(page));
          next.set("sort", sort);
          return next;
        });
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError("We couldn't load your courses. Please try again in a moment.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, page, sort, setSearchParams]);

  const canPrev = (data?.number ?? 0) > 0;
  const canNext = data ? data.number < data.totalPages - 1 : false;

  const emptyState = useMemo(() => {
    if (loading) {
      return null;
    }

    if (error) {
      return (
        <EmptyState
          title="Unable to fetch courses"
          description={error}
          action={
            <Button onClick={() => setPage(0)} variant="primary">
              Retry
            </Button>
          }
        />
      );
    }

    if (data && data.content.length === 0) {
      return (
        <EmptyState
          title="No courses to display"
          description="Try adjusting your search keywords or clear the filter to see the full catalog."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setQuery("")} variant="secondary">
                Clear search
              </Button>
              <Button onClick={() => setPage(0)} variant="primary">
                Reload list
              </Button>
            </div>
          }
        />
      );
    }

    return null;
  }, [data, error, loading]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 p-8 md:p-12 shadow-2xl gradient-animated">
        <div className="relative z-10">
          <Badge variant="primary" size="md" className="mb-4 bg-white/20 border-white/30 text-white backdrop-blur-sm">
            ✨ Explore Courses
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Discover Your Learning Path
          </h1>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl">
            Browse {totalResults}+ curated courses crafted by expert mentors. Master new skills at your own pace.
          </p>
          
          {/* Search Bar - Prominent in Hero */}
          <div className="max-w-2xl">
            <SearchInput
              placeholder="Search courses, topics, or instructors..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="shadow-2xl ring-2 ring-white/20"
            />
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">Filter:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === "all"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:bg-primary-50"
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === "in-progress"
                ? "bg-warm-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-warm-300 hover:bg-warm-50"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === "completed"
                ? "bg-accent-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-accent-300 hover:bg-accent-50"
            }`}
          >
            Completed
          </button>
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {data && !loading && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{totalResults}</span>
          <span>courses found</span>
          {debouncedQuery && (
            <>
              <span>for</span>
              <Badge variant="primary" size="sm">
                "{debouncedQuery}"
              </Badge>
            </>
          )}
        </div>
      )}

      {/* Course Grid/List */}
      {loading && (!data || data.content.length === 0) ? (
        <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : emptyState ? (
        emptyState
      ) : (
        <>
          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
            {data?.content.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-sm text-slate-600">
                Page <span className="font-bold text-slate-900">{data.number + 1}</span> of{" "}
                <span className="font-bold text-slate-900">{data.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  disabled={!canPrev || loading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  disabled={!canNext || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
