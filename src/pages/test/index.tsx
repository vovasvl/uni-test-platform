// pages/test/[id].tsx
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    LinearProgress,
    Paper,
    Alert,
    Chip,
} from '@mui/material';
import {
    ArrowBack,
    TimerOutlined,
    CheckCircle,
    Warning,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function TestPage() {
    const router = useRouter();
    const { id } = router.query;
    const [timeLeft, setTimeLeft] = useState(1800); // 30 минут в секундах
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [activeQuestion, setActiveQuestion] = useState(0);

    const testData = {
        id: 1,
        title: 'Основы алгоритмов',
        description: 'Тест по основам алгоритмов и структурам данных',
        duration: 30,
        questions: [
            {
                id: 1,
                text: 'Что из перечисленного является структурой данных?',
                type: 'multiple',
                options: ['Массив', 'Функция', 'Стек', 'Класс'],
                correctAnswers: [0, 2],
            },
            {
                id: 2,
                text: 'Сложность алгоритма быстрой сортировки в среднем случае:',
                type: 'single',
                options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
                correctAnswers: [1],
            },
        ],
    };

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswerChange = (questionId: number, value: any) => {
        setAnswers({
            ...answers,
            [questionId]: value,
        });
    };

    const handleSubmit = () => {
        console.log('Ответы:', answers);
        // Отправка на сервер
        router.push('/test/result/1');
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => router.back()}
                sx={{ mb: 3 }}
            >
                Назад
            </Button>

            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {testData.title}
                </Typography>
                <Chip
                    icon={<TimerOutlined />}
                    label={`Осталось: ${formatTime(timeLeft)}`}
                    color={timeLeft < 300 ? 'error' : 'primary'}
                    variant="outlined"
                />
            </Box>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
                {testData.description}
            </Typography>

            <LinearProgress
                variant="determinate"
                value={((activeQuestion + 1) / testData.questions.length) * 100}
                sx={{ mb: 3, height: 8, borderRadius: 4 }}
            />

            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Вопрос {activeQuestion + 1} из{' '}
                        {testData.questions.length}
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, fontWeight: 500 }}>
                        {testData.questions[activeQuestion].text}
                    </Typography>

                    {testData.questions[activeQuestion].type === 'single' ? (
                        <RadioGroup
                            value={
                                answers[
                                    testData.questions[activeQuestion].id
                                ] || ''
                            }
                            onChange={(e) =>
                                handleAnswerChange(
                                    testData.questions[activeQuestion].id,
                                    e.target.value,
                                )
                            }
                        >
                            {testData.questions[activeQuestion].options.map(
                                (option: string, index: number) => (
                                    <FormControlLabel
                                        key={index}
                                        value={index}
                                        control={<Radio />}
                                        label={option}
                                        sx={{ mb: 1 }}
                                    />
                                ),
                            )}
                        </RadioGroup>
                    ) : (
                        <Box>
                            {testData.questions[activeQuestion].options.map(
                                (option: string, index: number) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                checked={
                                                    answers[
                                                        testData.questions[
                                                            activeQuestion
                                                        ].id
                                                    ]?.includes(index) || false
                                                }
                                                onChange={(e) => {
                                                    const currentAnswers =
                                                        answers[
                                                            testData.questions[
                                                                activeQuestion
                                                            ].id
                                                        ] || [];
                                                    const newAnswers = e.target
                                                        .checked
                                                        ? [
                                                              ...currentAnswers,
                                                              index,
                                                          ]
                                                        : currentAnswers.filter(
                                                              (i: number) =>
                                                                  i !== index,
                                                          );

                                                    handleAnswerChange(
                                                        testData.questions[
                                                            activeQuestion
                                                        ].id,
                                                        newAnswers,
                                                    );
                                                }}
                                            />
                                        }
                                        label={option}
                                        sx={{ mb: 1, display: 'flex' }}
                                    />
                                ),
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
                <Button
                    variant="outlined"
                    disabled={activeQuestion === 0}
                    onClick={() => setActiveQuestion((prev) => prev - 1)}
                >
                    Назад
                </Button>

                {activeQuestion < testData.questions.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={() => setActiveQuestion((prev) => prev + 1)}
                    >
                        Следующий вопрос
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        endIcon={<CheckCircle />}
                    >
                        Завершить тест
                    </Button>
                )}
            </Box>

            {timeLeft < 300 && (
                <Alert severity="warning" sx={{ mt: 3 }}>
                    Внимание! Осталось мало времени. Рекомендуем завершить тест.
                </Alert>
            )}
        </Container>
    );
}
