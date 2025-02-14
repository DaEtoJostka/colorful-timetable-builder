
import { Course } from "@/types/course";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CourseBlockProps {
  course: Course;
  onClick?: () => void;
}

const typeColors = {
  lecture: "bg-[#E5DEFF]",
  lab: "bg-[#FDE1D3]",
  seminar: "bg-[#D3E4FD]",
};

const CourseBlock = ({ course, onClick }: CourseBlockProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer",
        typeColors[course.type]
      )}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-1">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {course.type}
        </div>
        <h3 className="font-medium text-gray-900">{course.title}</h3>
        <div className="text-sm text-gray-600">
          {course.startTime} - {course.endTime}
        </div>
        <div className="text-sm text-gray-600">{course.location}</div>
        {course.professor && (
          <div className="text-sm text-gray-600">{course.professor}</div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseBlock;
