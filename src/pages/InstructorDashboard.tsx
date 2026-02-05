import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  BookOpen,
  Users,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  GraduationCap,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInstructorCourses,
  useIsInstructor,
  useBecomeInstructor,
  useDeleteCourse,
  useUpdateCourse,
} from "@/hooks/use-instructor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: isInstructor, isLoading: checkingRole } = useIsInstructor();
  const { data: courses, isLoading: loadingCourses } = useInstructorCourses();
  const becomeInstructorMutation = useBecomeInstructor();
  const deleteMutation = useDeleteCourse();
  const updateMutation = useUpdateCourse();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleBecomeInstructor = async () => {
    try {
      await becomeInstructorMutation.mutateAsync();
      toast.success("You are now an instructor!");
    } catch (error) {
      toast.error("Failed to become an instructor");
    }
  };

  const handleDelete = async (courseId: string) => {
    setDeletingId(courseId);
    try {
      await deleteMutation.mutateAsync(courseId);
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      await updateMutation.mutateAsync({
        courseId,
        data: { isPublished: !currentStatus },
      });
      toast.success(currentStatus ? "Course unpublished" : "Course published!");
    } catch (error) {
      toast.error("Failed to update course status");
    }
  };

  // Stats
  const totalCourses = courses?.length || 0;
  const publishedCourses = courses?.filter((c) => c.is_published).length || 0;
  const totalStudents = courses?.reduce((acc, c) => acc + (c.enrollmentCount || 0), 0) || 0;
  const totalLessons = courses?.reduce(
    (acc, c) => acc + (c.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0),
    0
  ) || 0;

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  // Not an instructor yet
  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Become an Instructor</CardTitle>
              <CardDescription>
                Share your knowledge with thousands of learners. Create courses, build your audience, and earn money.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full"
                onClick={handleBecomeInstructor}
                disabled={becomeInstructorMutation.isPending}
              >
                {becomeInstructorMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <GraduationCap className="h-4 w-4 mr-2" />
                )}
                Start Teaching Today
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8" />
                Instructor Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your courses and track student progress
              </p>
            </div>
            <Button asChild>
              <Link to="/instructor/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedCourses} published
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  across all courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Lessons
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLessons}</div>
                <p className="text-xs text-muted-foreground">
                  video, quiz & assignments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Students/Course
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  per course average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Courses List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>
                Manage your courses, modules, and lessons
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : courses?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No courses yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first course to get started
                  </p>
                  <Button asChild>
                    <Link to="/instructor/courses/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses?.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="h-20 w-32 rounded-lg bg-muted shrink-0 overflow-hidden">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {course.title}
                          </h3>
                          <Badge variant={course.is_published ? "default" : "secondary"}>
                            {course.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {course.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{course.modules?.length || 0} modules</span>
                          <span>
                            {course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0} lessons
                          </span>
                          <span>{course.enrollmentCount || 0} students</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(course.id, course.is_published ?? false)}
                          disabled={updateMutation.isPending}
                        >
                          {course.is_published ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/instructor/courses/${course.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{course.title}"? This action cannot be undone.
                                All modules, lessons, and student enrollments will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(course.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === course.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
