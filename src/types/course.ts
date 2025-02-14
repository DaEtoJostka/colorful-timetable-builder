
export type CourseType = 'lecture' | 'lab' | 'seminar';

export interface Course {
  id: string;
  title: string;
  type: CourseType;
  startTime: string;
  endTime: string;
  location: string;
  dayOfWeek: number;
  professor?: string;
}
