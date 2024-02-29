import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import PlusIcon from "@mui/icons-material/Add";
import TaskList from "../components/TaskList";
import PopUpEditTask from "../components/PopUpEditTask";
import PopUpCreateCategory from "../components/PopUpCreateCategory";
import RemoveIcon from "@mui/icons-material/Remove";
import PopUpDeleteCategory from "../components/PopUpDeleteCategory";
import React from "react";

export interface TaskDetails {
    id: string;
    text: string;
    creation_date: string;
    forseen_end_date: string;
    state: string;
    user_id: string;
    category_id: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    tasks: TaskDetails[];
}

const TasksPage = () => {
    const [openPopUpEditTask, setOpenPopUpEditTask] = useState(false);
    const [isTaskUpdate, setIsTaskUpdate] = useState(true);

    const [openPopUpCreateCategory, setOpenPopUpCreateCategory] =
        useState(false);

    const [openPopUpDeleteCategory, setOpenPopUpDeleteCategory] =
        useState(false);

    const [tasks, setTasks] = useState<TaskDetails[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [areTasksReloaded, setAreTasksReloaded] = useState(false);
    const [areCategoriesReloaded, setAreCategoriesReloaded] = useState(false);

    const reloadTasks = () => {
        setAreTasksReloaded(!areTasksReloaded);
    };

    const reloadCategories = () => {
        setAreCategoriesReloaded(!areCategoriesReloaded);
    };

    useEffect(() => {
        getTasksById(setTasks);
    }, [areTasksReloaded]);

    useEffect(() => {
        getCategories(setCategories);
    }, [areCategoriesReloaded]);

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
            <Button
                variant="text"
                startIcon={<PlusIcon />}
                onClick={() => {
                    setOpenPopUpCreateCategory(true);
                }}
            >
                Add category
            </Button>
            <Button
                variant="text"
                startIcon={<RemoveIcon />}
                onClick={() => {
                    setOpenPopUpDeleteCategory(true);
                }}
            >
                Delete category
            </Button>
            <PopUpEditTask
                openPopUpEditTask={openPopUpEditTask}
                setOpenPopUpEditTask={setOpenPopUpEditTask}
                handleClose={handleClose}
                isUpdate={isTaskUpdate}
                reloadTasks={reloadTasks}
                reloadCategories={reloadCategories}
                categories={categories}
            />
            <PopUpCreateCategory
                openPopUpCreateCategory={openPopUpCreateCategory}
                setOpenPopUpCreateCategory={setOpenPopUpCreateCategory}
            />
            <PopUpDeleteCategory
                openPopUpDeleteCategory={openPopUpDeleteCategory}
                setOpenPopUpDeleteCategory={setOpenPopUpDeleteCategory}
                reloadTasks={reloadTasks}
                reloadCategories={reloadCategories}
                categories={categories}
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

const getTasksById = async (
    setTasks: React.Dispatch<React.SetStateAction<TaskDetails[]>>
) => {
    const user_id = localStorage.getItem("user_id");
    const response = await fetch(
        `http://localhost:8000/users/${user_id}/tasks`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (response.status === 200) {
        const data = await response.json();
        setTasks(data);
    } else {
        alert("Error obtaining tasks");
    }
};

const getCategories = async (
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
    const response = await fetch(`http://localhost:8000/categories/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const data = await response.json();
    setCategories(data);
};
