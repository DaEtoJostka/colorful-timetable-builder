import React from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Course } from '../types/course';
import { TimeSlot, DEFAULT_TIME_SLOTS } from '../types/timeSlots';
import styled from 'styled-components';
import { CourseBlock } from './CourseBlock';

const TimetableContainer = styled.div`
  overflow-x: auto;
  padding: 0;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin: 0 -15px;

  @media (min-width: 768px) {
    margin: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(6, minmax(120px, 1fr));
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  min-width: 800px;
`;

const HeaderCell = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  line-height: 1.4;
  text-align: left;

  &:last-child {
    border-right: none;
  }
`;

const TimeSlotRow = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(6, minmax(120px, 1fr));
  min-width: 800px;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const TimeCell = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  color: #4a5568;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  
  .start-time {
    display: block;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 2px;
  }

  .end-time {
    display: block;
    font-size: 12px;
    color: #718096;
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
  padding: 10px 16px;
  background: ${props => 
    props.type === 'lecture' ? '#ffebee' :
    props.type === 'lab' ? 'rgba(19, 164, 236, 0.1)' :
    props.type === 'practice' ? 'rgba(19, 109, 236, 0.1)' :
    props.type === 'exam' ? '#fff3e0' :
    '#f3e5f5'};
  border-left: 4px solid ${props =>
    props.type === 'lecture' ? '#ef5350' :
    props.type === 'lab' ? 'rgb(19, 164, 236)' :
    props.type === 'practice' ? 'rgb(19, 109, 236)' :
    props.type === 'exam' ? '#ff9800' :
    '#ab47bc'};
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-right: 1px solid #e0e0e0;

  &:hover {
    transform: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }

  @media (min-width: 768px) {
    white-space: normal;
    -webkit-line-clamp: 3;
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

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: block;
    padding: 10px;
    background: #fff;
    margin-bottom: 5px;
    border-radius: 4px;
    font-weight: bold;
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
        <MobileOnly>Прокрутите вправо для просмотра расписания →</MobileOnly>
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