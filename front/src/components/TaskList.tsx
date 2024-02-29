import { Box, List, ListItem } from "@mui/material";
import Task from "./Task";
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
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default TaskList;
