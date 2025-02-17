import React, { useState, useEffect } from 'react';
import { Course } from './types/course';
import { TimeSlot } from './types/timeSlots';
import { Timetable } from './components/Timetable';
import { CourseForm } from './components/CourseForm';
import styled from 'styled-components';
import { ScheduleTemplate } from './types/course';
import { v4 as uuidv4 } from 'uuid';
import { MdEdit, MdAdd, MdDelete } from 'react-icons/md';

const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'success' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.variant === 'danger' ? '#fff' : '#f8f9fa'};
  color: ${props => 
    props.variant === 'primary' ? '#2196f3' :
    props.variant === 'success' ? '#4CAF50' :
    '#f44336'};
  border: 1px solid;
  border-color: ${props => 
    props.variant === 'primary' ? '#2196f3' :
    props.variant === 'success' ? '#4CAF50' :
    '#f44336'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${props => 
      props.variant === 'primary' ? '#e3f2fd' :
      props.variant === 'success' ? '#e8f5e9' :
      '#ffebee'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  svg {
    font-size: 18px;
    color: inherit;
  }
`;

const TemplateSelect = styled.select`
  padding: 8px 30px 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  min-width: 200px;
  appearance: none;
  background: white;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #2196f3;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
  }
`;

const SaveNotification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const App: React.FC = () => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(() => {
    try {
      const savedData = localStorage.getItem('scheduleData');
      if (savedData) {
        const { templates } = JSON.parse(savedData);
        return templates.length ? templates : [{
          id: 'default',
          name: 'Основное расписание',
          courses: []
        }];
      }
      // Для обратной совместимости с предыдущей версией
      const oldTemplates = localStorage.getItem('scheduleTemplates');
      return oldTemplates ? JSON.parse(oldTemplates) : [{
        id: 'default',
        name: 'Основное расписание',
        courses: []
      }];
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return [{
        id: 'default',
        name: 'Основное расписание',
        courses: []
      }];
    }
  });
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(() => {
    try {
      const savedData = localStorage.getItem('scheduleData');
      return savedData ? JSON.parse(savedData).currentTemplateId : 'default';
    } catch (error) {
      console.error('Ошибка загрузки текущего шаблона:', error);
      return 'default';
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | undefined>();
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editedTemplateName, setEditedTemplateName] = useState('');
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const currentCourses = templates.find(t => t.id === currentTemplateId)?.courses || [];

  useEffect(() => {
    const saveData = {
      templates,
      currentTemplateId
    };

    try {
      localStorage.setItem('scheduleData', JSON.stringify(saveData));
      setShowSaveNotification(true);
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
      alert('Не удалось сохранить данные. Возможно, недостаточно места в хранилище.');
    }
  }, [templates, currentTemplateId]);

  useEffect(() => {
    if (showSaveNotification) {
      const timer = setTimeout(() => {
        setShowSaveNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaveNotification]);

  const handleAddCourse = (timeSlot: TimeSlot, dayIndex: number) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedDayIndex(dayIndex);
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSubmit = (course: Course) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === currentTemplateId) {
        const courses = selectedCourse
          ? template.courses.map(c => c.id === selectedCourse.id ? course : c)
          : [...template.courses, course];
        return { ...template, courses };
      }
      return template;
    }));
    setIsModalOpen(false);
    resetModal();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetModal();
  };

  const resetModal = () => {
    setSelectedTimeSlot(undefined);
    setSelectedDayIndex(undefined);
    setSelectedCourse(undefined);
  };

  const createNewTemplate = () => {
    const newTemplate: ScheduleTemplate = {
      id: uuidv4(),
      name: `Новый шаблон (${templates.length + 1})`,
      courses: []
    };
    setTemplates(prev => [...prev, newTemplate]);
    setCurrentTemplateId(newTemplate.id);
  };

  const deleteCurrentTemplate = () => {
    if (templates.length > 1) {
      setTemplates(prev => prev.filter(t => t.id !== currentTemplateId));
      setCurrentTemplateId(templates[0].id);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTemplateId(e.target.value);
  };

  const handleMoveCourse = (course: Course, newTimeSlot: TimeSlot, newDayIndex: number) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === currentTemplateId) {
        return {
          ...template,
          courses: template.courses.map(c =>
            c.id === course.id
              ? { ...c, startTime: newTimeSlot.startTime, endTime: newTimeSlot.endTime, dayOfWeek: newDayIndex }
              : c
          )
        };
      }
      return template;
    }));
  };

  const startEditingTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplateId(templateId);
      setEditedTemplateName(template.name);
    }
  };

  const saveTemplateName = () => {
    if (!editedTemplateName.trim()) return;
    
    setTemplates(prev => prev.map(template => 
      template.id === editingTemplateId 
        ? { ...template, name: editedTemplateName.trim() }
        : template
    ));
    setEditingTemplateId(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === currentTemplateId) {
        return {
          ...template,
          courses: template.courses.filter(c => c.id !== courseId)
        };
      }
      return template;
    }));
    setIsModalOpen(false);
    resetModal();
  };

  return (
    <AppContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Расписание занятий
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <TemplateSelect 
              value={currentTemplateId} 
              onChange={handleTemplateChange}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </TemplateSelect>
            {editingTemplateId === currentTemplateId ? (
              <input
                value={editedTemplateName}
                onChange={(e) => setEditedTemplateName(e.target.value)}
                onBlur={saveTemplateName}
                onKeyPress={(e) => e.key === 'Enter' && saveTemplateName()}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  padding: '8px 12px',
                  border: '2px solid #2196f3',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            ) : null}
          </div>

          <ActionButton 
            variant="primary"
            onClick={() => startEditingTemplate(currentTemplateId)}
          >
            <MdEdit /> Переименовать
          </ActionButton>
          
          <ActionButton 
            variant="success"
            onClick={createNewTemplate}
          >
            <MdAdd /> Новый шаблон
          </ActionButton>
          
          {templates.length > 1 && (
            <ActionButton
              variant="danger"
              onClick={deleteCurrentTemplate}
            >
              <MdDelete /> Удалить шаблон
            </ActionButton>
          )}
        </div>
      </div>
      
      <Timetable
        key={currentTemplateId}
        courses={currentCourses}
        onAddCourse={handleAddCourse}
        onEditCourse={handleEditCourse}
        onMoveCourse={handleMoveCourse}
      />

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <CourseForm
              timeSlot={selectedTimeSlot}
              dayIndex={selectedDayIndex}
              course={selectedCourse}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onDelete={selectedCourse ? () => handleDeleteCourse(selectedCourse.id) : undefined}
            />
          </ModalContent>
        </Modal>
      )}

      {showSaveNotification && (
        <SaveNotification>
          Изменения сохранены ✓
        </SaveNotification>
      )}
    </AppContainer>
  );
}; 