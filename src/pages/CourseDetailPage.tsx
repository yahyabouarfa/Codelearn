import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  completeModule,
  fetchCourseDetails,
  requestSupportAccess
} from "../api/courses";
import type { CourseDetailDto, ModuleDto, SupportDto } from "../types/api";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ModuleItem } from "../components/ui/ModuleItem";
import { SupportItem } from "../components/ui/SupportItem";
import { Card } from "../components/ui/Card";
import { useToast } from "../components/ui/Toast";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import ProgressBar from "../components/ui/ProgressBar";
import Avatar from "../components/ui/Avatar";

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const numericCourseId = Number(courseId);

  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [accessingId, setAccessingId] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (Number.isNaN(numericCourseId)) {
      navigate("/");
      return;
    }

    const loadCourse = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const details = await fetchCourseDetails(numericCourseId);
        setCourse(details);
      } catch (err) {
        console.error(err);
        setLoadError("This course could not be loaded. Please return to the catalog.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [navigate, numericCourseId]);

  const handleSupportAccess = async (supportId: number) => {
    setAccessingId(supportId);
    try {
      const result = await requestSupportAccess(supportId);
      addToast({
        tone: "info",
        title: "Access Granted",
        message: `Link expires at ${new Date(result.expiresAt).toLocaleTimeString()}`,
        duration: 4000,
      });
      window.open(result.temporaryUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      addToast({
        tone: "error",
        title: "Access Failed",
        message: "Unable to access this resource. Please try again.",
        duration: 5000,
      });
    } finally {
      setAccessingId(null);
    }
  };

  const handleCompleteModule = async (moduleId: number) => {
    if (!course) return;
    
    setCompletingId(moduleId);
    try {
      const progress = await completeModule(course.id, moduleId);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map((module) =>
                module.id === moduleId
                  ? { ...module, completed: true, completedAt: progress.completedAt }
                  : module
              )
            }
          : prev
      );
      
      addToast({
        tone: "success",
        title: "Module Completed! 🎉",
        message: `Marked as completed on ${new Date(progress.completedAt).toLocaleDateString()}`,
        duration: 4000,
      });
    } catch (err) {
      console.error(err);
      addToast({
        tone: "error",
        title: "Completion Failed",
        message: "Couldn't mark this module as completed. Please retry.",
        duration: 5000,
      });
    } finally {
      setCompletingId(null);
    }
  };

  const supports: SupportDto[] = useMemo(() => course?.supports ?? [], [course]);
  const modules: ModuleDto[] = useMemo(() => course?.modules ?? [], [course]);
  const completedCount = modules.filter((m) => m.completed).length;
  const completionRate = Math.round((completedCount / (modules.length || 1)) * 100);

  // Check for milestones
  const hasMilestone = completedCount === 1 || completionRate === 50 || completionRate === 100;

  if (loading) {
    return <LoadingState message="Loading course details..." />;
  }

  if (loadError || !course) {
    return (
      <EmptyState
        title={loadError ? "Something went wrong" : "Course not found"}
        description={loadError || "We couldn't find this course."}
        action={
          <Button variant="outline" onClick={() => navigate("/")} size="lg">
            Back to Courses
          </Button>
        }
      />
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "content", label: "Content", icon: "📚", badge: modules.length },
    { id: "resources", label: "Resources", icon: "📁", badge: supports.length },
    { id: "progress", label: "Progress", icon: "📊" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Immersive Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          {/* Course Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl">
              <span className="text-6xl md:text-7xl">📚</span>
            </div>
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <Avatar name={course.authorName} size="lg" />
              <div>
                <Badge variant="primary" size="sm" className="mb-2 bg-white/20 border-white/30 text-white backdrop-blur-sm">
                  Course #{course.id}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {course.title}
                </h1>
                <p className="text-lg text-primary-100">
                  by {course.authorName}
                </p>
              </div>
            </div>
            
            <p className="text-primary-100 text-lg max-w-3xl">
              {course.description}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-xs text-primary-200 font-medium">Modules</p>
                  <p className="text-lg font-bold text-white">{modules.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-2xl">📁</span>
                <div>
                  <p className="text-xs text-primary-200 font-medium">Resources</p>
                  <p className="text-lg font-bold text-white">{supports.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-xs text-primary-200 font-medium">Completion</p>
                  <p className="text-lg font-bold text-white">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Achievement Badge */}
      {hasMilestone && completionRate === 100 && (
        <Card variant="gradient" className="border-2 border-accent-300 bg-gradient-to-r from-accent-50 to-accent-100 animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-float">🏆</div>
            <div>
              <h3 className="text-lg font-bold text-accent-900 mb-1">Course Completed!</h3>
              <p className="text-sm text-accent-700">Congratulations on finishing all modules! 🎉</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      {/* Tab Content */}
      <TabPanel activeTab={activeTab} tabId="overview">
        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="elevated" padding="lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>📝</span>
              <span>About This Course</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              {course.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  👤
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Instructor</p>
                  <p className="text-sm font-semibold text-slate-900">{course.authorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent-100 flex items-center justify-center text-accent-600">
                  📚
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Modules</p>
                  <p className="text-sm font-semibold text-slate-900">{modules.length} learning modules</p>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Your Progress</span>
            </h2>
            <div className="space-y-4">
              <ProgressBar value={completionRate} showLabel size="lg" color="accent" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-accent-50 rounded-xl">
                  <p className="text-2xl font-bold text-accent-600">{completedCount}</p>
                  <p className="text-xs text-accent-700 font-medium">Completed</p>
                </div>
                <div className="text-center p-4 bg-slate-100 rounded-xl">
                  <p className="text-2xl font-bold text-slate-600">{modules.length - completedCount}</p>
                  <p className="text-xs text-slate-700 font-medium">Remaining</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="content">
        <Card variant="flat" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Course Modules</h2>
            <Badge variant="primary" size="md">
              {completedCount} / {modules.length} completed
            </Badge>
          </div>
          
          {modules.length === 0 ? (
            <EmptyState
              title="No modules yet"
              description="This course doesn't have any modules at the moment."
            />
          ) : (
            <div className="space-y-3">
              {modules.map((module, index) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  onComplete={() => handleCompleteModule(module.id)}
                  loading={completingId === module.id}
                  index={index + 1}
                />
              ))}
            </div>
          )}
        </Card>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="resources">
        <Card variant="flat" padding="lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Support Resources</h2>
          
          {supports.length === 0 ? (
            <EmptyState
              title="No resources available"
              description="This course doesn't have any support materials yet."
            />
          ) : (
            <div className="space-y-3">
              {supports.map((support) => (
                <SupportItem
                  key={support.id}
                  support={support}
                  onAccess={() => handleSupportAccess(support.id)}
                  loading={accessingId === support.id}
                />
              ))}
            </div>
          )}
        </Card>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="progress">
        <div className="space-y-6">
          <Card variant="elevated" padding="lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Timeline</h2>
            
            {completedCount === 0 ? (
              <EmptyState
                title="No progress yet"
                description="Start completing modules to see your learning timeline."
              />
            ) : (
              <div className="space-y-4">
                {modules
                  .filter((m) => m.completed)
                  .sort((a, b) => 
                    new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
                  )
                  .map((module) => (
                    <div
                      key={module.id}
                      className="flex items-start gap-4 p-4 bg-accent-50 border-l-4 border-accent-500 rounded-lg animate-fade-in"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{module.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Completed on {new Date(module.completedAt!).toLocaleDateString()} at{" "}
                          {new Date(module.completedAt!).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </TabPanel>
    </div>
  );
};
