// pages/teacher/tests/create.tsx
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    Stack,
} from '@mui/material';
import {
    Add,
    Close,
    Delete,
    ShortText,
    RadioButtonChecked,
    CheckBox,
    Subject,
} from '@mui/icons-material';
import { useState } from 'react';

const questionTypes = [
    { value: 'text', label: 'Текстовый ответ', icon: <ShortText /> },
    { value: 'single', label: 'Один вариант', icon: <RadioButtonChecked /> },
    { value: 'multiple', label: 'Несколько вариантов', icon: <CheckBox /> },
];

export default function CreateTestPage() {
    const [testData, setTestData] = useState({
        title: '',
        description: '',
        duration: 60,
        questions: [] as any[],
    });

    const addQuestion = (type: string) => {
        const newQuestion = {
            id: Date.now(),
            type,
            text: '',
            options: type === 'text' ? [] : ['', ''],
            correctAnswers: [],
        };
        setTestData({
            ...testData,
            questions: [...testData.questions, newQuestion],
        });
    };

    const removeQuestion = (id: number) => {
        setTestData({
            ...testData,
            questions: testData.questions.filter((q) => q.id !== id),
        });
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700 }}
                >
                    Создание нового теста
                </Typography>
                <Typography color="text.secondary">
                    Заполните основные данные и добавьте вопросы
                </Typography>
            </Box>

            <Card elevation={3} sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Название теста"
                                fullWidth
                                value={testData.title}
                                onChange={(e) =>
                                    setTestData({
                                        ...testData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Длительность (мин)</InputLabel>
                                <Select
                                    value={testData.duration}
                                    onChange={(e) =>
                                        setTestData({
                                            ...testData,
                                            duration: e.target.value as number,
                                        })
                                    }
                                    label="Длительность (мин)"
                                >
                                    {[15, 30, 45, 60, 90, 120].map((value) => (
                                        <MenuItem key={value} value={value}>
                                            {value} минут
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Описание теста"
                                fullWidth
                                multiline
                                rows={3}
                                value={testData.description}
                                onChange={(e) =>
                                    setTestData({
                                        ...testData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box
                sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
            >
                <Typography variant="h6">Вопросы теста</Typography>
                <Box>
                    {questionTypes.map((type) => (
                        <Button
                            key={type.value}
                            startIcon={type.icon}
                            onClick={() => addQuestion(type.value)}
                            sx={{ ml: 1 }}
                        >
                            {type.label}
                        </Button>
                    ))}
                </Box>
            </Box>

            {testData.questions.map((question, index) => (
                <Card key={question.id} elevation={2} sx={{ mb: 3 }}>
                    <CardHeader
                        title={`Вопрос ${index + 1}`}
                        action={
                            <IconButton
                                onClick={() => removeQuestion(question.id)}
                            >
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <TextField
                            label="Текст вопроса"
                            fullWidth
                            value={question.text}
                            onChange={(e) => {
                                const updatedQuestions = [
                                    ...testData.questions,
                                ];
                                updatedQuestions[index].text = e.target.value;
                                setTestData({
                                    ...testData,
                                    questions: updatedQuestions,
                                });
                            }}
                            sx={{ mb: 3 }}
                        />

                        {question.type !== 'text' && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                    Варианты ответов (отметьте правильные)
                                </Typography>

                                {question.options.map(
                                    (option: string, optIndex: number) => (
                                        <Box
                                            key={optIndex}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 1,
                                            }}
                                        >
                                            {question.type === 'single' ? (
                                                <RadioButtonChecked
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                            ) : (
                                                <CheckBox
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                            )}
                                            <TextField
                                                fullWidth
                                                variant="standard"
                                                value={option}
                                                onChange={(e) => {
                                                    const updatedQuestions = [
                                                        ...testData.questions,
                                                    ];
                                                    updatedQuestions[
                                                        index
                                                    ].options[optIndex] =
                                                        e.target.value;
                                                    setTestData({
                                                        ...testData,
                                                        questions:
                                                            updatedQuestions,
                                                    });
                                                }}
                                            />
                                            <IconButton
                                                disabled={
                                                    question.options.length <= 2
                                                }
                                                onClick={() => {
                                                    const updatedQuestions = [
                                                        ...testData.questions,
                                                    ];
                                                    updatedQuestions[
                                                        index
                                                    ].options.splice(
                                                        optIndex,
                                                        1,
                                                    );
                                                    setTestData({
                                                        ...testData,
                                                        questions:
                                                            updatedQuestions,
                                                    });
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    ),
                                )}

                                <Button
                                    startIcon={<Add />}
                                    onClick={() => {
                                        const updatedQuestions = [
                                            ...testData.questions,
                                        ];
                                        updatedQuestions[index].options.push(
                                            '',
                                        );
                                        setTestData({
                                            ...testData,
                                            questions: updatedQuestions,
                                        });
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    Добавить вариант
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button variant="outlined" sx={{ mr: 2 }}>
                    Сохранить черновик
                </Button>
                <Button variant="contained" size="large">
                    Опубликовать тест
                </Button>
            </Box>
        </Container>
    );
}
