//import { AccountCircle } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import {
    Button,
    Dialog,
    DialogContent,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from "@mui/material";
import React from "react";
//import Task from "./Task";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TaskDetails } from "./TaskList";
import { Category } from "../pages/TasksPage";

interface PopUpEditTaskProps {
    openPopUpEditTask: boolean;
    setOpenPopUpEditTask: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;
    isUpdate: boolean;
    reloadTasks: () => void;
    reloadCategories: () => void;
    categories: Category[];
}

interface TaskCreate {
    text: string;
    forseen_end_date: string;
    state: string;
    user_id: string;
    category_id: string;
}

const PopUpEditTask = ({
    openPopUpEditTask,
    setOpenPopUpEditTask,
    handleClose,
    isUpdate,
    reloadTasks,
    reloadCategories,
    categories,
}: PopUpEditTaskProps) => {
    const [date, setDate] = React.useState<Dayjs | null>(dayjs("2025-04-17"));
    const defaultHour = dayjs().hour(12).minute(0);
    const [time, setTime] = React.useState<Dayjs | null>(defaultHour);
    const [category, setCategory] = React.useState("");
    const [status, setStatus] = React.useState("");

    const [text, setText] = React.useState("");

    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const formattedTime = dayjs(time).format("HH:mm:ss");

    const handleClick = () => {
        reloadCategories();
        setOpenPopUpEditTask(false);

        const task: TaskCreate = {
            text: text,
            forseen_end_date: `${formattedDate}T${formattedTime}`,
            state: status,
            user_id: localStorage.getItem("user_id")!,
            category_id: category,
        };

        if (isUpdate) {
            console.log("updateTask");
            saveTaskInfoInLocalStorage();
            updateTask({ taskToUpdate: task, reloadTasks }); // task id que no se donde esta!!!
        } else {
            createTask({ newTask: task, reloadTasks });
        }
    };

    return (
        <Dialog
            open={openPopUpEditTask}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <Stack spacing={2} direction="column">
                    <TextField
                        id="input-with-sx"
                        label="Task description"
                        variant="standard"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <TaskButtons
                        text={text}
                        date={date}
                        time={time}
                        category={category}
                        status={status}
                        setDate={setDate}
                        setTime={setTime}
                        setCategory={setCategory}
                        setStatus={setStatus}
                        categories={categories}
                    />
                    <Divider />
                    <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="contained"
                            size="medium"
                            onClick={handleClose}
                        >
                            {"Cancel"}
                        </Button>
                        <Button
                            variant="contained"
                            size="medium"
                            onClick={handleClick}
                        >
                            {isUpdate ? "Update task" : "Add task"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

interface TaskButtonsProps {
    text: string;
    date: Dayjs | null;
    time: Dayjs | null;
    category: string;
    status: string;
    setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    setTime: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    categories: Category[];
}

const TaskButtons = ({
    text,
    date,
    time,
    category,
    status,
    setDate,
    setTime,
    setCategory,
    setStatus,
    categories,
}: TaskButtonsProps) => {
    const [isOpenCategory, setIsOpenCategory] = React.useState(false);

    const handleOpenCategory = () => {
        setIsOpenCategory(true);
        //getCategories(setCategories);
    };

    const handleDatePickerChange = (newDate: Dayjs | null) => {
        setDate(newDate);
    };

    const handleTimePickerChange = (newTime: Dayjs | null) => {
        setTime(newTime);
    };

    const handleChangeEditCategory = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };
    const handleChangeEditStatus = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    return (
        <Stack spacing={2} direction="column">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date"
                    value={date}
                    onChange={handleDatePickerChange}
                />
                <TimePicker
                    label="Time"
                    value={time}
                    onChange={handleTimePickerChange}
                />
            </LocalizationProvider>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Category"
                    onChange={handleChangeEditCategory}
                    open={isOpenCategory}
                    onOpen={handleOpenCategory}
                    onClose={() => setIsOpenCategory(false)}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="Status"
                    onChange={handleChangeEditStatus}
                >
                    <MenuItem value={"TODO"}>Todo</MenuItem>
                    <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                    <MenuItem value={"DONE"}>Done</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
};

export default PopUpEditTask;

interface createTaskProps {
    newTask: TaskCreate;
    reloadTasks: () => void;
}

const createTask = async ({ newTask, reloadTasks }: createTaskProps) => {
    const response = await fetch(`http://localhost:8000/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
        },
        body: JSON.stringify({
            text: newTask.text,
            forseen_end_date: newTask.forseen_end_date,
            state: newTask.state,
            user_id: newTask.user_id,
            category_id: newTask.category_id,
        }),
    });

    if (response.status === 201) {
        const data = await response.json();
        reloadTasks();
    } else if (response.status === 404) {
        alert("To create a task, you need to include all the required fields");
    } else if (response.status === 400) {
        alert("Forseen end date must be after creation date");
    } else if (response.status === 422) {
        alert("To create a task, you need to include a valid time");
    }
};

interface updateTaskProps {
    taskToUpdate: TaskCreate;
    reloadTasks: () => void;
}

const updateTask = async ({ taskToUpdate, reloadTasks }: updateTaskProps) => {
    const putOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            accept: "application/json",
        },
        body: JSON.stringify({
            text: taskToUpdate.text,
            forseen_end_date: taskToUpdate.forseen_end_date,
            state: taskToUpdate.state,
            category_id: taskToUpdate.category_id,
        }),
    };

    const response = await fetch(
        `http://localhost:8000/tasks/${localStorage.getItem("task_id")}`,
        putOptions
    );

    if (response.status === 200) {
        const data = await response.json();
        reloadTasks();
    } else if (response.status === 400) {
        alert("Forseen end date must be after creation date");
    }
};

const saveTaskInfoInLocalStorage = async () => {
    const response = await fetch(
        `http://localhost:8000/tasks/${localStorage.getItem("task_id")}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    const data = await response.json();
    localStorage.setItem("forseen_end_date", data.forseen_end_date.toString());
    localStorage.setItem("text", data.text);
    localStorage.setItem("state", data.state);
    localStorage.setItem("category_id", data.category_id);
    localStorage.setItem("creation_date", data.creation_date);
};
