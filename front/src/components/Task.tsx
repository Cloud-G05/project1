import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import ThreeDots from "./ThreeDots";
import { TaskDetails } from "./TaskList";
import React from "react";

interface TaskProps {
    setOpenPopUpEditTask: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTaskUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    task_details: TaskDetails;
    task_id: string;
    reloadTasks: () => void;
}

const Task = ({
    setOpenPopUpEditTask,
    setIsTaskUpdate,
    task_details,
    task_id,
    reloadTasks,
}: TaskProps) => {
    return (
        <div className="task">
            <Card sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography
                            component="div"
                            variant="h5"
                            sx={{ flexGrow: 1 }}
                        >
                            {task_details.text}
                        </Typography>
                        <TaskButtons
                            setOpenPopUpEditTask={setOpenPopUpEditTask}
                            setIsTaskUpdate={setIsTaskUpdate}
                            task_details={task_details}
                            task_id={task_id}
                            reloadTasks={reloadTasks}
                        />
                    </CardContent>
                </Box>
                <ThreeDots
                    setOpenPopUpEditTask={setOpenPopUpEditTask}
                    setIsTaskUpdate={setIsTaskUpdate}
                    task_id={task_id}
                    reloadTasks={reloadTasks}
                />
            </Card>
        </div>
    );
};

const TaskButtons = ({
    setOpenPopUpEditTask,
    setIsTaskUpdate,
    task_details,
    task_id,
}: TaskProps) => {
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        const getCategoryName = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/categories/${task_details.category_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                if (response.status === 200) {
                    const data = await response.json();
                    setCategoryName(data.name);
                } else {
                    setCategoryName("Category not found");
                }
            } catch (error) {
                console.error("Error fetching category name:", error);
                setCategoryName("Category not found");
            }
        };

        getCategoryName();
    }, [task_details.category_id]);

    return (
        <Stack spacing={2} direction="row">
            {[
                task_details.forseen_end_date,
                categoryName,
                task_details.state,
            ].map((text) => (
                <Chip key={text} label={text} />
            ))}
        </Stack>
    );
};

export default Task;
