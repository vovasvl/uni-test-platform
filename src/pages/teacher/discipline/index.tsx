'use client';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  TextField,
  IconButton,
  Collapse,
  Paper,
  Stack,
  Avatar,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
import {
  Add,
  Quiz,
  Groups,
  ArrowBack,
  Edit,
  Delete,
  PersonAdd,
  ExpandMore,
  ExpandLess,
  Folder,
  InsertDriveFile,
  DragHandle,
  Close,
  Check
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function DisciplinePage() {
  const router = useRouter();
  const { id } = router.query;
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true
  });

  // Mock data
  const [discipline, setDiscipline] = useState({
    id: 1,
    name: 'Электромеханика',
    description: 'Основы электромеханических систем и устройств',
    groups: [
      { id: 1, name: 'EM-201', students: 25 },
      { id: 2, name: 'EM-202', students: 20 }
    ],
    chapters: [
      {
        id: 1,
        title: 'Глава 1: Основные понятия электромеханики',
        tests: [
          { id: 1, name: 'Тест по базовым понятиям' },
          { id: 2, name: 'Контрольная работа №1' }
        ]
      },
      {
        id: 2,
        title: 'Глава 2: Электрические машины',
        tests: [
          { id: 3, name: 'Тест по трансформаторам' },
          { id: 4, name: 'Лабораторная работа' }
        ]
      },
      {
        id: 3,
        title: 'Глава 3: Автоматизированные системы',
        tests: []
      }
    ]
  });

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.type === 'CHAPTERS') {
      const items = Array.from(discipline.chapters);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setDiscipline({...discipline, chapters: items});
    } else if (result.type === 'TESTS') {
      const chapterIndex = discipline.chapters.findIndex(ch => ch.id.toString() === result.destination.droppableId);
      if (chapterIndex === -1) return;
      
      const chapter = discipline.chapters[chapterIndex];
      const items = Array.from(chapter.tests);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      const newChapters = [...discipline.chapters];
      newChapters[chapterIndex].tests = items;
      setDiscipline({...discipline, chapters: newChapters});
    }
  };

  const addChapter = () => {
    const newChapter = {
      id: Math.max(...discipline.chapters.map(c => c.id)) + 1,
      title: `Глава ${discipline.chapters.length + 1}: Новая глава`,
      tests: []
    };
    setDiscipline({
      ...discipline, 
      chapters: [...discipline.chapters, newChapter]
    });
    setExpandedChapters(prev => ({...prev, [newChapter.id]: true}));
  };

  const addTest = (chapterId: number) => {
    const chapterIndex = discipline.chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return;
    
    const newTest = {
      id: Math.max(...discipline.chapters.flatMap(c => c.tests).map(t => t.id)) + 1,
      name: 'Новый тест'
    };
    
    const newChapters = [...discipline.chapters];
    newChapters[chapterIndex].tests.push(newTest);
    setDiscipline({...discipline, chapters: newChapters});
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {discipline.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {editMode ? (
          <Stack direction="row" spacing={2}>
            <Button 
              startIcon={<Close />}
              onClick={() => setEditMode(false)}
            >
              Отменить
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Check />}
              onClick={() => setEditMode(false)}
            >
              Сохранить
            </Button>
          </Stack>
        ) : (
          <Button 
            startIcon={<Edit />}
            onClick={() => setEditMode(true)}
          >
            Редактировать
          </Button>
        )}
      </Box>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {discipline.description}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 4 }}
      >
        <Tab label="Структура курса" />
        <Tab label="Группы" />
        <Tab label="Настройки" />
      </Tabs>

      {tabValue === 0 && (
        <Card elevation={3}>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="chapters" type="CHAPTERS">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {discipline.chapters.map((chapter, chapterIndex) => (
                      <Draggable 
                        key={chapter.id} 
                        draggableId={`chapter-${chapter.id}`} 
                        index={chapterIndex}
                        isDragDisabled={!editMode}
                      >
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            elevation={2}
                            sx={{ mb: 2 }}
                          >
                            <ListItemButton
                              onClick={() => !editMode && toggleChapter(chapter.id)}
                              sx={{
                                p: 2,
                                bgcolor: 'background.paper',
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                              }}
                            >
                              {editMode && (
                                <div {...provided.dragHandleProps}>
                                  <DragHandle sx={{ mr: 2 }} />
                                </div>
                              )}
                              <Folder sx={{ mr: 2, color: 'text.secondary' }} />
                              <ListItemText
                                primary={chapter.title}
                              />
                              {expandedChapters[chapter.id] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>

                            <Collapse in={expandedChapters[chapter.id]}>
                              <Droppable droppableId={chapter.id.toString()} type="TESTS">
                                {(provided) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ paddingLeft: editMode ? '40px' : '32px' }}
                                  >
                                    <List dense disablePadding>
                                      {chapter.tests.map((test, testIndex) => (
                                        <Draggable 
                                          key={test.id} 
                                          draggableId={`test-${test.id}`} 
                                          index={testIndex}
                                          isDragDisabled={!editMode}
                                        >
                                          {(provided) => (
                                            <Paper
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              elevation={0}
                                              sx={{ 
                                                borderLeft: '2px solid',
                                                borderColor: 'divider',
                                                mb: 0.5
                                              }}
                                            >
                                              <ListItemButton 
                                                onClick={() => !editMode && router.push(`/teacher/tests/${test.id}`)}
                                              >
                                                {editMode && (
                                                  <div {...provided.dragHandleProps}>
                                                    <DragHandle sx={{ mr: 2 }} />
                                                  </div>
                                                )}
                                                <Avatar sx={{ 
                                                  bgcolor: 'background.default', 
                                                  width: 24, 
                                                  height: 24,
                                                  mr: 2
                                                }}>
                                                  <InsertDriveFile color="primary" fontSize="small" />
                                                </Avatar>
                                                <ListItemText
                                                  primary={test.name}
                                                />
                                              </ListItemButton>
                                            </Paper>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </List>
                                  </div>
                                )}
                              </Droppable>
                              
                              {editMode && (
                                <Box sx={{ pl: 4, pb: 1 }}>
                                  <Button 
                                    size="small" 
                                    startIcon={<Add />}
                                    onClick={() => addTest(chapter.id)}
                                  >
                                    Новый тест
                                  </Button>
                                </Box>
                              )}
                            </Collapse>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {editMode && (
              <Box sx={{ p: 2 }}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<Add />}
                  onClick={addChapter}
                >
                  Добавить главу
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Группы на курсе
            </Typography>
            <List>
              {discipline.groups.map((group) => (
                <ListItem 
                  key={group.id}
                  secondaryAction={
                    <Button size="small" href={`/teacher/groups/${group.id}`}>
                      Перейти
                    </Button>
                  }
                >
                  <ListItemText
                    primary={group.name}
                    secondary={`${group.students} студентов`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Настройки дисциплины
            </Typography>
            <TextField
              label="Название дисциплины"
              fullWidth
              defaultValue={discipline.name}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Описание"
              multiline
              rows={4}
              fullWidth
              defaultValue={discipline.description}
              sx={{ mb: 3 }}
            />
            <Button variant="contained">Сохранить изменения</Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}