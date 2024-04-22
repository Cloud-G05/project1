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
import React, { useState, useContext } from "react";
//import Task from "./Task";

interface PopUpEditTaskProps {
    openPopUpEditTask: boolean;
    setOpenPopUpEditTask: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;
    isUpdate: boolean;
    reloadTasks: () => void;
}

interface TaskCreate {
    input_file_path: string;
    converted_file_ext: string;
    name: string;
    user_email: string;
}

const PopUpEditTask = ({
    openPopUpEditTask,
    setOpenPopUpEditTask,
    handleClose,
    isUpdate,
    reloadTasks,
}: PopUpEditTaskProps) => {
    const [date, setDate] = React.useState<Dayjs | null>(dayjs("2025-04-17"));
    const defaultHour = dayjs().hour(12).minute(0);
    const [time, setTime] = React.useState<Dayjs | null>(defaultHour);

    const [input_file_path, setInput_file_path] = React.useState("/uploads/");
    const [name, setName] = React.useState("");
    const [converted_file_ext, setConverted_file_ext] = React.useState("pdf");
    const [file, setFile] = React.useState<File | null>(null); // Nuevo estado para el archivo

    const handleClick = async () => {
        setOpenPopUpEditTask(false);
        if (file != null) {
            await uploadFile({ newFile: file, reloadTasks });
            const task: TaskCreate = {
                input_file_path: input_file_path + file.name,
                name: name,
                converted_file_ext: converted_file_ext,
                user_email: localStorage.getItem("user_email")!,
            };
            await createTask({ newTask: task, reloadTasks });
        } else {
            alert("El campo del archivo está vacío");
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
                        label="Task name"
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        id="input-with-sx"
                        label="Task converted_file_ext"
                        variant="standard"
                        value={converted_file_ext}
                        onChange={(e) => setInput_file_path(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files![0])}
                    />{" "}
                    {/* Campo de carga de archivos */}
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
                            {"Add task"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default PopUpEditTask;

interface createTaskProps {
    newTask: TaskCreate;
    reloadTasks: () => void;
}

const createTask = async ({ newTask, reloadTasks }: createTaskProps) => {
    const response = await fetch(`http://34.110.178.166:80/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
        },
        body: JSON.stringify({
            input_file_path: newTask.input_file_path,
            name: newTask.name,
            converted_file_ext: newTask.converted_file_ext,
            user_email: newTask.user_email,
        }),
    });

    if (response.status === 201) {
        const data = await response.json();
        reloadTasks();
        // Temporizador de 3 segundos
        setTimeout(() => {
            console.log("Reloaded tasks after 3 seconds");
            reloadTasks();
        }, 3000);
    } else if (response.status === 404) {
        alert("To create a task, you need to include all the required fields");
    } else if (response.status === 400) {
        alert("Forseen end date must be after creation date");
    } else if (response.status === 422) {
        alert("To create a task, you need to include a valid time");
    }
};

interface createFileProps {
    newFile: File;
    reloadTasks: () => void;
}

const uploadFile = async ({ newFile, reloadTasks }: createFileProps) => {
    const formData = new FormData(); // Crear objeto FormData
    formData.append("file", newFile);
    const response = await fetch("http://34.110.178.166:80/files/uploadfile", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // Usar el objeto FormData como cuerpo de la solicitud
    });

    if (response.ok) {
        console.log("Archivo enviado exitosamente.");
    } else {
        console.error("Error al enviar el archivo.");
    }
};
