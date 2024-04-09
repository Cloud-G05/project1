import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

interface ThreeDotsProps {
    setOpenPopUpEditTask: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTaskUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    task_id: string;
    reloadTasks: () => void;
    input_file_path: string;
    output_file_path: string;
}

export default function ThreeDots({
    setOpenPopUpEditTask,
    setIsTaskUpdate,
    task_id,
    reloadTasks,
    input_file_path,
    output_file_path,
}: ThreeDotsProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickDeleteTask = async () => {
        await deleteTask({ task_id, reloadTasks });
        alert("Tarea eliminada con éxito");
    };

    const handleDownloadInput = () => {
        downloadInputFile(input_file_path);
    };

    const handleDownloadOutput = () => {
        downloadOutputFile(output_file_path);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDownloadInput}>
                    <DownloadIcon />
                    {"Download org"}
                </MenuItem>
                <MenuItem onClick={handleDownloadOutput}>
                    <DownloadIcon />
                    {"Download pdf"}
                </MenuItem>
                <MenuItem onClick={handleClickDeleteTask}>
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                    {"Delete task"}
                </MenuItem>
            </Menu>
        </div>
    );
}

interface deleteTaskProps {
    task_id: string;
    reloadTasks: () => void;
}

const deleteTask = async ({ task_id, reloadTasks }: deleteTaskProps) => {
    const response = await fetch(`http://34.48.93.67:8000/tasks/${task_id}`, {
        method: "DELETE",
        headers: {
            accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response.status === 204) {
        reloadTasks();
    } else {
        alert("Failed to delete task. Please try again.");
    }
};

const downloadInputFile = async (input_file_path: string) => {
    const fileName = input_file_path.split("/").pop();
    const token = localStorage.getItem("token");
    const response = await fetch(`http://34.48.93.67:8000/files/${fileName}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token, // Si necesitas enviar un token de autenticación
        },
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        if (fileName != null) {
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            // Verificar si el nodo padre existe antes de intentar eliminar el enlace
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }
    } else {
        console.error("Error al descargar el archivo");
    }
};

const downloadOutputFile = async (output_file_path: string) => {
    const fileName = output_file_path.split("/").pop();
    const token = localStorage.getItem("token");
    const response = await fetch(`http://34.48.93.67:8000/files/${fileName}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token, // Si necesitas enviar un token de autenticación
        },
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        if (fileName != null) {
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            // Verificar si el nodo padre existe antes de intentar eliminar el enlace
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }
    } else {
        console.error("Error al descargar el archivo");
    }
};
