import React, { useState, useEffect } from 'react';
import { Course } from './types/course';
import { TimeSlot } from './types/timeSlots';
import { Timetable } from './components/Timetable';
import { CourseForm } from './components/CourseForm';
import styled from 'styled-components';
import { ScheduleTemplate } from './types/course';
import { v4 as uuidv4 } from 'uuid';

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

export const App: React.FC = () => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(() => {
    const saved = localStorage.getItem('scheduleTemplates');
    return saved ? JSON.parse(saved) : [{
      id: 'default',
      name: 'Основное расписание',
      courses: []
    }];
  });
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | undefined>();
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editedTemplateName, setEditedTemplateName] = useState('');

  const currentCourses = templates.find(t => t.id === currentTemplateId)?.courses || [];

  useEffect(() => {
    localStorage.setItem('scheduleTemplates', JSON.stringify(templates));
  }, [templates]);

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

  return (
    <AppContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Расписание занятий
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select 
              value={currentTemplateId} 
              onChange={handleTemplateChange}
              style={{ 
                padding: '8px 30px 8px 12px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                minWidth: '200px',
                appearance: 'none'
              }}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
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
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            ) : null}
          </div>

          <button 
            onClick={() => startEditingTemplate(currentTemplateId)}
            style={{
              padding: '8px 12px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Переименовать
          </button>
          
          <button 
            onClick={createNewTemplate}
            style={{
              padding: '8px 12px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Новый шаблон
          </button>
          
          {templates.length > 1 && (
            <button
              onClick={deleteCurrentTemplate}
              style={{
                padding: '8px 12px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Удалить шаблон
            </button>
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
            />
          </ModalContent>
        </Modal>
      )}
    </AppContainer>
  );
}; 