import React from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Course } from '../types/course';
import { TimeSlot, DEFAULT_TIME_SLOTS } from '../types/timeSlots';
import styled from 'styled-components';
import { CourseBlock } from './CourseBlock';

const TimetableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f5f5f5;
  padding: 20px;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(6, 1fr);
  gap: 1px;
  background: #fff;
  margin-bottom: 10px;
`;

const HeaderCell = styled.div`
  padding: 10px;
  background: #fff;
  text-align: center;
  font-weight: bold;
`;

const TimeSlotRow = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(6, 1fr);
  gap: 1px;
  margin-bottom: 1px;
`;

const TimeCell = styled.div`
  padding: 10px;
  background: #fff;
  text-align: center;
  font-size: 0.9em;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .start-time {
    font-weight: bold;
    margin-bottom: 2px;
    color: #333;
  }

  .end-time {
    font-size: 0.9em;
    color: #666;
  }
`;

const CoursesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  background: #fff;
  min-height: 100px;
  position: relative;
  transition: padding-bottom 0.2s ease-in-out;

  &:hover {
    background: #f8f8f8;
    padding-bottom: 40px;
  }

  &:hover .add-button {
    opacity: 1;
    visibility: visible;
  }

  &.can-drop {
    background: #e3f2fd;
  }
`;

const CourseCell = styled.div<{ type: string }>`
  padding: 8px;
  background: ${props => 
    props.type === 'lecture' ? '#ffebee' :
    props.type === 'lab' ? '#e3f2fd' :
    props.type === 'exam' ? '#fff3e0' :
    '#f3e5f5'};
  border-left: 4px solid ${props =>
    props.type === 'lecture' ? '#ef5350' :
    props.type === 'lab' ? '#2196f3' :
    props.type === 'exam' ? '#ff9800' :
    '#ab47bc'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
  z-index: 1;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const AddButton = styled.button`
  padding: 4px 8px;
  background: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
  color: #666;
  width: calc(100% - 10px);
  position: absolute;
  bottom: 5px;
  left: 5px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  z-index: 0;

  &:hover {
    background: #d0d0d0;
  }
`;

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

interface DropTargetProps {
  timeSlot: TimeSlot;
  dayIndex: number;
  children: React.ReactNode;
  onMoveCourse: (course: Course, newTimeSlot: TimeSlot, newDayIndex: number) => void;
}

const DropTarget: React.FC<DropTargetProps> = ({ timeSlot, dayIndex, children, onMoveCourse }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COURSE',
    drop: (item: Course) => {
      onMoveCourse(item, timeSlot, dayIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <CoursesContainer ref={drop} className={isOver ? 'can-drop' : ''}>
      {children}
    </CoursesContainer>
  );
};

interface TimetableProps {
  courses: Course[];
  onAddCourse?: (timeSlot: TimeSlot, dayIndex: number) => void;
  onEditCourse?: (course: Course) => void;
  onMoveCourse?: (course: Course, newTimeSlot: TimeSlot, newDayIndex: number) => void;
}

export const Timetable: React.FC<TimetableProps> = ({
  courses,
  onAddCourse,
  onEditCourse,
  onMoveCourse,
}) => {
  const getCoursesForSlot = (timeSlot: TimeSlot, dayIndex: number) => {
    return courses.filter(
      course => 
        course.startTime === timeSlot.startTime &&
        course.dayOfWeek === dayIndex
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TimetableContainer>
        <Header>
          <HeaderCell>Время</HeaderCell>
          {days.map((day, index) => (
            <HeaderCell key={day}>{day}</HeaderCell>
          ))}
        </Header>

        {DEFAULT_TIME_SLOTS.map((timeSlot) => (
          <TimeSlotRow key={timeSlot.id}>
            <TimeCell>
              <span className="start-time">{timeSlot.startTime}</span>
              <span className="end-time">{timeSlot.endTime}</span>
            </TimeCell>
            {days.map((_, dayIndex) => {
              const slotCourses = getCoursesForSlot(timeSlot, dayIndex);
              return (
                <DropTarget
                  key={dayIndex}
                  timeSlot={timeSlot}
                  dayIndex={dayIndex}
                  onMoveCourse={onMoveCourse!}
                >
                  {slotCourses.map(course => (
                    <CourseBlock
                      key={course.id}
                      course={course}
                      onEdit={onEditCourse}
                    />
                  ))}
                  <AddButton 
                    className="add-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddCourse?.(timeSlot, dayIndex);
                    }}
                  >
                    + Добавить занятие
                  </AddButton>
                </DropTarget>
              );
            })}
          </TimeSlotRow>
        ))}
      </TimetableContainer>
    </DndProvider>
  );
}; 