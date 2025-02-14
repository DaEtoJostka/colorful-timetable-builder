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
`;

const CourseCell = styled.div<{ type: string }>`
  padding: 10px;
  background: ${props => 
    props.type === 'lecture' ? '#ffebee' :
    props.type === 'lab' ? '#e3f2fd' :
    '#f3e5f5'};
  border-left: 4px solid ${props =>
    props.type === 'lecture' ? '#ef5350' :
    props.type === 'lab' ? '#2196f3' :
    '#ab47bc'};
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const EmptyCell = styled.div`
  padding: 10px;
  background: #fff;
  min-height: 100px;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
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
  const getCourseForSlot = (timeSlot: TimeSlot, dayIndex: number) => {
    return courses.find(
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
            {timeSlot.startTime}-{timeSlot.endTime}
          </TimeCell>
          {days.map((_, dayIndex) => {
            const course = getCourseForSlot(timeSlot, dayIndex);
            return course ? (
              <CourseCell
                key={dayIndex}
                type={course.type}
                onClick={() => onEditCourse?.(course)}
              >
                <div>{course.title}</div>
                <div style={{ fontSize: '0.8em' }}>{course.location}</div>
                {course.professor && (
                  <div style={{ fontSize: '0.8em' }}>{course.professor}</div>
                )}
              </CourseCell>
            ) : (
              <EmptyCell
                key={dayIndex}
                onClick={() => onAddCourse?.(timeSlot, dayIndex)}
              />
            );
          })}
        </TimeSlotRow>
      ))}
    </TimetableContainer>
  );
}; 