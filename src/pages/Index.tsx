
import { useState } from "react";
import { Course } from "@/types/course";
import CourseBlock from "@/components/CourseBlock";
import CourseForm from "@/components/CourseForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCourse = (courseData: Omit<Course, "id">) => {
    const newCourse = {
      ...courseData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCourses([...courses, newCourse]);
    setIsFormOpen(false);
    toast({
      title: "Course added",
      description: "The course has been added to your timetable.",
    });
  };

  const coursesGroupedByDay = DAYS.map((day, index) => ({
    day,
    courses: courses.filter((course) => course.dayOfWeek === index + 1),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">University Timetable</h1>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coursesGroupedByDay.map(({ day, courses }) => (
            <div
              key={day}
              className="bg-white p-6 rounded-lg shadow-sm space-y-4 animate-fadeIn"
            >
              <h2 className="text-lg font-semibold text-gray-900">{day}</h2>
              <div className="space-y-3">
                {courses.length === 0 ? (
                  <p className="text-gray-500 text-sm">No courses scheduled</p>
                ) : (
                  courses
                    .sort(
                      (a, b) =>
                        new Date(`1970/01/01 ${a.startTime}`).getTime() -
                        new Date(`1970/01/01 ${b.startTime}`).getTime()
                    )
                    .map((course) => (
                      <CourseBlock key={course.id} course={course} />
                    ))
                )}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm
              onSubmit={handleAddCourse}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
