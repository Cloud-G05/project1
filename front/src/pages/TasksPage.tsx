import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import PlusIcon from "@mui/icons-material/Add";
import TaskList from "../components/TaskList";
import PopUpEditTask from "../components/PopUpEditTask";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";

export interface TaskDetails {
    id: string;
    name: string;
    original_file_ext: string;
    converted_file_ext: string;
    available: boolean;
    status: string;
    time_stamp: Date;
    input_file_path: string;
    output_file_path: string;
    user_email: string;
}

const TasksPage = () => {
    const [openPopUpEditTask, setOpenPopUpEditTask] = useState(false);
    const [isTaskUpdate, setIsTaskUpdate] = useState(true);

    const [tasks, setTasks] = useState<TaskDetails[]>([]);

    const [areTasksReloaded, setAreTasksReloaded] = useState(false);

    const reloadTasks = () => {
        setAreTasksReloaded(!areTasksReloaded);
    };

    useEffect(() => {
        getTasksByEmail(setTasks);
    }, [areTasksReloaded]);

    const handleClose = () => {
        setOpenPopUpEditTask(false);
    };

    return (
        <div>
            <Button
                variant="text"
                startIcon={<PlusIcon />}
                onClick={() => {
                    setIsTaskUpdate(false); // If not an update, the task is new
                    setOpenPopUpEditTask(true);
                }}
            >
                Add task
            </Button>
            <PopUpEditTask
                openPopUpEditTask={openPopUpEditTask}
                setOpenPopUpEditTask={setOpenPopUpEditTask}
                handleClose={handleClose}
                isUpdate={isTaskUpdate}
                reloadTasks={reloadTasks}
            />
            <TaskList
                setOpenPopUpEditTask={setOpenPopUpEditTask}
                setIsTaskUpdate={setIsTaskUpdate}
                tasks={tasks}
                reloadTasks={reloadTasks}
            />
        </div>
    );
};

export default TasksPage;

const getTasksByEmail = async (
    setTasks: React.Dispatch<React.SetStateAction<TaskDetails[]>>
) => {
    const userEmail = localStorage.getItem("user_email");
    console.log(userEmail);
    const response = await fetch(
        `http://34.48.93.67:8000/tasks?email=${encodeURIComponent(userEmail!)}`, // Envía el correo electrónico como parámetro de consulta
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (response.ok) {
        const data = await response.json();
        setTasks(data);
    } else {
        alert("Error obtaining tasks");
    }
};
