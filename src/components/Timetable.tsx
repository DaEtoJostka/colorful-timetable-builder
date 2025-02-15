import React, { useState } from 'react';
import { Course } from '../types/course';
import { TimeSlot, DEFAULT_TIME_SLOTS } from '../types/timeSlots';
import styled from 'styled-components';

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
  }

  .end-time {
    font-size: 0.9em;
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
`;

const CourseCell = styled.div<{ type: string }>`
  padding: 8px;
  background: ${props => 
    props.type === 'lecture' ? '#ffebee' :
    props.type === 'lab' ? '#e3f2fd' :
    '#f3e5f5'};
  border-left: 4px solid ${props =>
    props.type === 'lecture' ? '#ef5350' :
    props.type === 'lab' ? '#2196f3' :
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

interface TimetableProps {
  courses: Course[];
  onAddCourse?: (timeSlot: TimeSlot, dayIndex: number) => void;
  onEditCourse?: (course: Course) => void;
}

export const Timetable: React.FC<TimetableProps> = ({
  courses,
  onAddCourse,
  onEditCourse,
}) => {
  const getCoursesForSlot = (timeSlot: TimeSlot, dayIndex: number) => {
    return courses.filter(
      course => 
        course.startTime === timeSlot.startTime &&
        course.dayOfWeek === dayIndex
    );
  };

  return (
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
              <CoursesContainer key={dayIndex}>
                {slotCourses.map(course => (
                  <CourseCell
                    key={course.id}
                    type={course.type}
                    onClick={() => onEditCourse?.(course)}
                  >
                    <div>{course.title}</div>
                    <div style={{ fontSize: '0.8em' }}>{course.location}</div>
                    {course.professor && (
                      <div style={{ fontSize: '0.8em' }}>{course.professor}</div>
                    )}
                  </CourseCell>
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
              </CoursesContainer>
            );
          })}
        </TimeSlotRow>
      ))}
    </TimetableContainer>
  );
}; 