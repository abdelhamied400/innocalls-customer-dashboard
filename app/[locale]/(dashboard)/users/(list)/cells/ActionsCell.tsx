"use client";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Cell } from "@/types/cell";
import { Block, Cached, Delete, MoreVert } from "@mui/icons-material";
import { User } from "../columns";
import usersService from "@/services/users.service";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";

type ActionsCellProps = Cell<User>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleActivate = async () => {
    try {
      setIsActivating(true);
      await usersService.activateUser(row.original.id);
      await queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate the users query to refresh the list
      toast({
        title: "User activated successfully",
        description: `User ${row.original.name} is now active.`,
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error activating user",
          description:
            error.response?.data?.message ||
            "An error occurred while activating the user.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error activating user",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setIsDeactivating(true);
      await usersService.deactivateUser(row.original.id);
      await queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate the users query to refresh the list
      toast({
        title: "User deactivated successfully",
        description: `User ${row.original.name} is now inactive.`,
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error deactivating user",
          description:
            error.response?.data?.message ||
            "An error occurred while deactivating the user.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error deactivating user",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await usersService.deleteUser(row.original.id);
      await queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate the users query to refresh the list
      toast({
        title: "User deleted successfully",
        description: `User ${row.original.name} has been deleted.`,
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error deleting user",
          description:
            error.response?.data?.message ||
            "An error occurred while deleting the user.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error deleting user",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
      setShowAlert(false);
    }
  };

  return (
    <div className="flex gap-2">
      {row.getValue("status") === "enabled" ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost-destructive"
              size="icon"
              disabled={isDeactivating}
              loading={isDeactivating}
            >
              <Block />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                you want to disable this user?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeactivate}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost-success"
              size="icon"
              disabled={isActivating}
              loading={isActivating}
            >
              <Cached />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                you want to enable this user?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleActivate}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVert />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => {
              setOpenDropdown(false); // close dropdown
              setShowAlert(true); // open alert
            }}
          >
            <Delete /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDeleting && (
        <Button variant="ghost-destructive" disabled>
          <Spinner />
          Deleting...
        </Button>
      )}

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You want to delete this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsCell;
