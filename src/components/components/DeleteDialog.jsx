// file: components/DeleteDialog.js

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import PropTypes from "prop-types";

const DeleteDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  item,
  handleDelete,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description} {item && `This will permanently delete the ${item}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

DeleteDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  item: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteDialog;
