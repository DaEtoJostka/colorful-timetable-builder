import React, { useState, useEffect } from 'react';
import { Course, CourseType } from '../types/course';
import { TimeSlot } from '../types/timeSlots';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #1976d2;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  background: #fff;
  color: #f44336;
  border: 1px solid #f44336;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: auto;

  &:hover {
    background: #ffebee;
  }
`;

interface CourseFormProps {
  timeSlot?: TimeSlot;
  dayIndex?: number;
  course?: Course;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  timeSlot,
  dayIndex,
  course,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    type: 'lecture' as CourseType,
    location: '',
    professor: '',
    ...course,
  });

  useEffect(() => {
    if (timeSlot && dayIndex !== undefined) {
      setFormData(prev => ({
        ...prev,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        dayOfWeek: dayIndex,
      }));
    }
  }, [timeSlot, dayIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: course?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...formData as Course,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Название</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Тип</Label>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="lecture">Лекция</option>
            <option value="lab">Лабораторная</option>
            <option value="practice">Практика</option>
            <option value="seminar">Семинар</option>
            <option value="exam">Экзамен</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Аудитория</Label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Преподаватель</Label>
          <Input
            name="professor"
            value={formData.professor}
            onChange={handleChange}
          />
        </FormGroup>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
          <Button type="submit">
            {course ? 'Сохранить' : 'Добавить'}
          </Button>
          <Button type="button" onClick={onCancel} style={{ background: '#f5f5f5', color: '#666', border: '1px solid #ddd' }}>
            Отмена
          </Button>
          {course && (
            <DeleteButton type="button" onClick={onDelete}>
              Удалить занятие
            </DeleteButton>
          )}
        </div>
      </Form>
    </FormContainer>
  );
};
