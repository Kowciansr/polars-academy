import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  GripVertical,
  Play,
  FileText,
  HelpCircle,
  Save,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInstructorCourses,
  useCreateCourse,
  useUpdateCourse,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  type InstructorCourse,
} from "@/hooks/use-instructor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const lessonTypeIcons = {
  video: Play,
  quiz: HelpCircle,
  assignment: FileText,
};

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = courseId === "new";

  const { data: courses, isLoading } = useInstructorCourses();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();

  const course = courses?.find((c) => c.id === courseId);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [openModules, setOpenModules] = useState<string[]>([]);

  // Load course data
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description || "");
      setPrice(String(course.price || 0));
      setThumbnailUrl(course.thumbnail_url || "");
      setOpenModules(course.modules?.map((m) => m.id) || []);
    }
  }, [course]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  }, [title, isNew]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isNew && !course && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button asChild>
              <Link to="/instructor">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSaveCourse = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    try {
      if (isNew) {
        const newCourse = await createCourseMutation.mutateAsync({
          title,
          slug,
          description,
          price: parseFloat(price) || 0,
          thumbnailUrl,
        });
        toast.success("Course created successfully!");
        navigate(`/instructor/courses/${newCourse.id}/edit`);
      } else {
        await updateCourseMutation.mutateAsync({
          courseId: course!.id,
          data: {
            title,
            slug,
            description,
            price: parseFloat(price) || 0,
            thumbnailUrl,
          },
        });
        toast.success("Course saved!");
      }
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  const handleAddModule = async () => {
    if (!course) return;

    try {
      const newModule = await createModuleMutation.mutateAsync({
        courseId: course.id,
        title: `Module ${(course.modules?.length || 0) + 1}`,
        orderIndex: course.modules?.length || 0,
      });
      setOpenModules((prev) => [...prev, newModule.id]);
      toast.success("Module added!");
    } catch (error) {
      toast.error("Failed to add module");
    }
  };

  const handleUpdateModule = async (moduleId: string, title: string) => {
    try {
      await updateModuleMutation.mutateAsync({
        moduleId,
        data: { title },
      });
    } catch (error) {
      toast.error("Failed to update module");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await deleteModuleMutation.mutateAsync(moduleId);
      toast.success("Module deleted!");
    } catch (error) {
      toast.error("Failed to delete module");
    }
  };

  const handleAddLesson = async (moduleId: string, lessonsCount: number) => {
    try {
      await createLessonMutation.mutateAsync({
        moduleId,
        title: `Lesson ${lessonsCount + 1}`,
        type: "video",
        orderIndex: lessonsCount,
      });
      toast.success("Lesson added!");
    } catch (error) {
      toast.error("Failed to add lesson");
    }
  };

  const handleUpdateLesson = async (
    lessonId: string,
    data: { title?: string; type?: "video" | "quiz" | "assignment"; duration?: string }
  ) => {
    try {
      await updateLessonMutation.mutateAsync({
        lessonId,
        data,
      });
    } catch (error) {
      toast.error("Failed to update lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLessonMutation.mutateAsync(lessonId);
      toast.success("Lesson deleted!");
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const isSaving = createCourseMutation.isPending || updateCourseMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/instructor">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {isNew ? "Create New Course" : "Edit Course"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isNew ? "Fill in the details to create your course" : course?.title}
              </p>
            </div>
            <Button onClick={handleSaveCourse} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isNew ? "Create Course" : "Save Changes"}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>
                    Basic information about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Complete Web Development Bootcamp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g., complete-web-development-bootcamp"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be used in the course URL
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what students will learn..."
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail URL</Label>
                      <Input
                        id="thumbnail"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Curriculum */}
              {!isNew && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Curriculum</CardTitle>
                        <CardDescription>
                          Organize your course into modules and lessons
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleAddModule}
                        disabled={createModuleMutation.isPending}
                      >
                        {createModuleMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        Add Module
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {course?.modules?.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No modules yet. Add your first module to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {course?.modules?.map((module, moduleIndex) => (
                          <Collapsible
                            key={module.id}
                            open={openModules.includes(module.id)}
                            onOpenChange={() => toggleModule(module.id)}
                          >
                            <div className="border rounded-lg">
                              <CollapsibleTrigger className="w-full">
                                <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                                    {moduleIndex + 1}
                                  </div>
                                  <Input
                                    value={module.title}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      handleUpdateModule(module.id, e.target.value)
                                    }
                                    onBlur={(e) =>
                                      handleUpdateModule(module.id, e.target.value)
                                    }
                                    className="flex-1 border-transparent hover:border-input focus:border-input"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {module.lessons?.length || 0} lessons
                                  </span>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Module</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure? All lessons in this module will be deleted.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteModule(module.id)}
                                          className="bg-destructive text-destructive-foreground"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 text-muted-foreground transition-transform",
                                      openModules.includes(module.id) && "rotate-180"
                                    )}
                                  />
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="border-t p-4 space-y-3">
                                  {module.lessons?.map((lesson) => {
                                    const Icon = lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons] || FileText;
                                    return (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                          value={lesson.title}
                                          onChange={(e) =>
                                            handleUpdateLesson(lesson.id, { title: e.target.value })
                                          }
                                          className="flex-1 h-8 text-sm"
                                        />
                                        <Select
                                          value={lesson.type}
                                          onValueChange={(value: "video" | "quiz" | "assignment") =>
                                            handleUpdateLesson(lesson.id, { type: value })
                                          }
                                        >
                                          <SelectTrigger className="w-28 h-8">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="quiz">Quiz</SelectItem>
                                            <SelectItem value="assignment">Assignment</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Input
                                          value={lesson.duration || ""}
                                          onChange={(e) =>
                                            handleUpdateLesson(lesson.id, { duration: e.target.value })
                                          }
                                          placeholder="5 min"
                                          className="w-20 h-8 text-sm"
                                        />
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete this lesson?
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="bg-destructive text-destructive-foreground"
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    );
                                  })}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      handleAddLesson(module.id, module.lessons?.length || 0)
                                    }
                                    disabled={createLessonMutation.isPending}
                                  >
                                    {createLessonMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <Plus className="h-4 w-4 mr-1" />
                                    )}
                                    Add Lesson
                                  </Button>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Course Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No thumbnail
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium mb-1">{title || "Untitled Course"}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description || "No description yet"}
                  </p>
                  {!isNew && course && (
                    <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span>{course.is_published ? "Published" : "Draft"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modules</span>
                        <span>{course.modules?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lessons</span>
                        <span>
                          {course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students</span>
                        <span>{course.enrollmentCount || 0}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Use a compelling title that describes what students will learn</p>
                  <p>• Add a high-quality thumbnail to attract students</p>
                  <p>• Break content into digestible modules and lessons</p>
                  <p>• Include quizzes to help students retain knowledge</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
