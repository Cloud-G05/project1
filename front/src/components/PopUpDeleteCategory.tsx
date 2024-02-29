import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { get } from "http";
import { useState } from "react";
import { Category } from "../pages/TasksPage";
import React from "react";

interface PopUpDeleteCategoryProps {
    openPopUpDeleteCategory: boolean;
    setOpenPopUpDeleteCategory: (value: boolean) => void;
    reloadTasks: () => void;
    reloadCategories: () => void;
    categories: Category[];
}

const PopUpDeleteCategory = (props: PopUpDeleteCategoryProps) => {
    const {
        openPopUpDeleteCategory,
        setOpenPopUpDeleteCategory,
        reloadTasks,
        reloadCategories,
        categories,
    } = props;
    const [category, setCategory] = useState("");
    //const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpenPopUpDeleteCategory(false);
    };

    const handleDeleteCategory = () => {
        deleteCategory(category, reloadCategories, reloadTasks);
        setOpenPopUpDeleteCategory(false);
    };

    const handleOpenCategories = () => {
        reloadCategories();
        setOpen(true);
    };

    const handleChangeDeleteCategory = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    return (
        <Dialog
            open={openPopUpDeleteCategory}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="form-dialog-title">Delete category</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Category
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={category}
                        label="Category"
                        onChange={handleChangeDeleteCategory}
                        open={open}
                        onOpen={handleOpenCategories}
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDeleteCategory} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopUpDeleteCategory;

const deleteCategory = async (
    id: string,
    reloadCategories: () => void,
    reloadTasks: () => void
) => {
    const response = await fetch(`http://localhost:8000/categories/${id}`, {
        method: "DELETE",
        headers: {
            accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (response.status == 204) {
        reloadCategories();
        reloadTasks();
    } else {
        alert("Failed to delete category. Please try again.");
    }
};
