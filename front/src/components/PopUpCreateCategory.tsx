import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useState } from "react";
import React from "react";

interface PopUpCreateCategoryProps {
    openPopUpCreateCategory: boolean;
    setOpenPopUpCreateCategory: (value: boolean) => void;
}

const PopUpCreateCategory = (props: PopUpCreateCategoryProps) => {
    const { openPopUpCreateCategory, setOpenPopUpCreateCategory } = props;
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const handleClose = () => {
        setOpenPopUpCreateCategory(false);
        setCategoryName("");
        setCategoryDescription("");
    };

    const handleCreateCategory = () => {
        createCategory(
            categoryName,
            setCategoryName,
            categoryDescription,
            setCategoryDescription
        );
        setOpenPopUpCreateCategory(false);
    };

    return (
        <Dialog
            open={openPopUpCreateCategory}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="form-dialog-title">Create category</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Category name"
                    type="text"
                    fullWidth
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Category description"
                    type="text"
                    fullWidth
                    onChange={(e) => setCategoryDescription(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreateCategory} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const createCategory = async (
    categoryName: string,
    setCategoryName: (value: string) => void,
    categoryDescription: string,
    setCategoryDescription: (value: string) => void
) => {
    // fetch POST request to create a category
    const response = await fetch("http://localhost:8000/categories/", {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            name: categoryName,
            description: categoryDescription,
        }),
    });

    if (response.status === 201) {
        setCategoryName("");
        setCategoryDescription("");
    } else if (response.status === 400) {
        alert(
            "To create a category, you need to include all the required fields"
        );
    } else if (response.status == 409) {
        alert("Category with this name already exists");
    }
};

export default PopUpCreateCategory;
