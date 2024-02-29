import { Box, List, ListItem } from "@mui/material";
import Task from "./Task";
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

interface TaskListProps {
    setOpenPopUpEditTask: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTaskUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    tasks: TaskDetails[];
    reloadTasks: () => void;
}

const TaskList = ({
    setOpenPopUpEditTask,
    setIsTaskUpdate,
    tasks,
    reloadTasks,
}: TaskListProps) => {
    return (
        <Box>
            <List>
                {tasks.map((task) => (
                    <ListItem key={task.id}>
                        <Task
                            setOpenPopUpEditTask={setOpenPopUpEditTask}
                            setIsTaskUpdate={setIsTaskUpdate}
                            task_details={task}
                            task_id={task.id}
                            reloadTasks={reloadTasks}
                            input_file_path={task.input_file_path}
                            output_file_path={task.output_file_path}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default TaskList;
