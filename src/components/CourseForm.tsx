
import { useState } from "react";
import { Course, CourseType } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseFormProps {
  onSubmit: (course: Omit<Course, "id">) => void;
  onCancel: () => void;
  initialData?: Course;
}

const CourseForm = ({ onSubmit, onCancel, initialData }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "lecture",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    location: initialData?.location || "",
    dayOfWeek: initialData?.dayOfWeek || 1,
    professor: initialData?.professor || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Course Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as CourseType })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lecture">Lecture</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="professor">Professor (Optional)</Label>
        <Input
          id="professor"
          value={formData.professor}
          onChange={(e) =>
            setFormData({ ...formData, professor: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day of Week</Label>
        <Select
          value={formData.dayOfWeek.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, dayOfWeek: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Monday</SelectItem>
            <SelectItem value="2">Tuesday</SelectItem>
            <SelectItem value="3">Wednesday</SelectItem>
            <SelectItem value="4">Thursday</SelectItem>
            <SelectItem value="5">Friday</SelectItem>
            <SelectItem value="6">Saturday</SelectItem>
            <SelectItem value="7">Sunday</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default CourseForm;
