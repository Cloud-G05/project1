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
    input_file_path: string;
    output_file_path: string;
}

const Task = ({
    setOpenPopUpEditTask,
    setIsTaskUpdate,
    task_details,
    task_id,
    reloadTasks,
    input_file_path,
    output_file_path
}: TaskProps) => {
    const cardStyle = {
        display: 'flex',
        backgroundColor: task_details.available ? 'inherit' : '#424242', // Gris oscuro si no está disponible
    };
    return (
        <div className="task">
            <Card sx={{ ...cardStyle }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography
                            component="div"
                            variant="h5"
                            sx={{ flexGrow: 1 }}
                        >
                            {task_details.name}
                        </Typography>
                        <TaskButtons
                            setOpenPopUpEditTask={setOpenPopUpEditTask}
                            setIsTaskUpdate={setIsTaskUpdate}
                            task_details={task_details}
                            task_id={task_id}
                            reloadTasks={reloadTasks}
                            input_file_path={input_file_path}
                            output_file_path={output_file_path}
                        />
                    </CardContent>
                </Box>
                {task_details.available && // Solo renderiza ThreeDots si está disponible
                    <ThreeDots
                        setOpenPopUpEditTask={setOpenPopUpEditTask}
                        setIsTaskUpdate={setIsTaskUpdate}
                        task_id={task_id}
                        reloadTasks={reloadTasks}
                        input_file_path={input_file_path}
                        output_file_path={output_file_path}
                    />
                }
            </Card>
        </div>
    );
};

const TaskButtons = ({
    setOpenPopUpEditTask,
    setIsTaskUpdate,
    task_details,
    task_id,
    input_file_path,
    output_file_path
}: TaskProps) => {

    

    return (
        <Stack spacing={2} direction="row">
            {[
                task_details.converted_file_ext,
                task_details.status,
            ].map((text) => (
                <Chip key={text} label={text} />
            ))}
        </Stack>
    );
};

export default Task;
