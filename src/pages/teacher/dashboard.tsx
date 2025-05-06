// pages/teacher/dashboard.tsx
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Avatar,
    Chip,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Tabs,
    Tab,
    Divider,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Add,
    Quiz,
    Groups,
    BarChart,
    AccessTime,
    CheckCircle,
    PendingActions,
    School,
    MoreVert,
    PersonAdd,
} from '@mui/icons-material';
import { useState } from 'react';

export default function TeacherDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const disciplines = [
        { id: 1, name: 'Алгоритмы и структуры данных', groups: 3, tests: 5 },
        { id: 2, name: 'Базы данных', groups: 2, tests: 3 },
        { id: 3, name: 'Веб-разработка', groups: 1, tests: 2 },
    ];

    const activeTests = [
        {
            id: 1,
            name: 'Сортировки и поиск',
            discipline: 'Алгоритмы',
            due: '2023-06-15',
            group: 'CS-201',
        },
        {
            id: 2,
            name: 'Нормальные формы',
            discipline: 'Базы данных',
            due: '2023-06-18',
            group: 'CS-202',
        },
    ];

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700 }}
                >
                    Панель преподавателя
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        href="/teacher/disciplines/create"
                        sx={{ mr: 2 }}
                    >
                        Новая дисциплина
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Groups />}
                        href="/teacher/groups/create"
                    >
                        Новая группа
                    </Button>
                </Box>
            </Box>

            <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{ mb: 4 }}
            >
                <Tab label="Активные тесты" icon={<Quiz />} />
                <Tab label="Дисциплины" icon={<School />} />
                <Tab label="Группы" icon={<Groups />} />
            </Tabs>

            {tabValue === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Текущие активные тесты
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<Add />}
                                        href="/teacher/tests/create"
                                    >
                                        Создать тест
                                    </Button>
                                </Box>

                                <List>
                                    {activeTests.map((test) => (
                                        <ListItem
                                            key={test.id}
                                            secondaryAction={
                                                <Chip
                                                    label={`Срок: ${test.due}`}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                    }}
                                                >
                                                    <Quiz />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={test.name}
                                                secondary={`${test.discipline} | Группа: ${test.group}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, fontWeight: 600 }}
                                >
                                    Быстрые действия
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    href="/teacher/students/add"
                                    sx={{ mb: 2 }}
                                >
                                    Добавить студентов
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Groups />}
                                    href="/teacher/groups"
                                >
                                    Управление группами
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Grid container spacing={3}>
                    {disciplines.map((discipline) => (
                        <Grid item xs={12} sm={6} md={4} key={discipline.id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {discipline.name}
                                        </Typography>
                                        <IconButton onClick={handleMenuOpen}>
                                            <MoreVert />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleMenuClose}>
                                                Редактировать
                                            </MenuItem>
                                            <MenuItem onClick={handleMenuClose}>
                                                Удалить
                                            </MenuItem>
                                        </Menu>
                                    </Box>

                                    <Box sx={{ display: 'flex', mt: 2 }}>
                                        <Chip
                                            label={`${discipline.groups} групп`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label={`${discipline.tests} тестов`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        href={`/teacher/disciplines/${discipline.id}`}
                                    >
                                        Перейти
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {tabValue === 2 && (
                <Card elevation={3}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ mb: 3, fontWeight: 600 }}
                        >
                            Все группы
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="CS-201"
                                    secondary="Алгоритмы и структуры данных | 25 студентов"
                                />
                                <Button size="small" href="/teacher/groups/1">
                                    Перейти
                                </Button>
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="CS-202"
                                    secondary="Базы данных | 20 студентов"
                                />
                                <Button size="small" href="/teacher/groups/2">
                                    Перейти
                                </Button>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
