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
  AlertDialogX,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Cell } from "@/types/cell";
import { Block, Cached, Delete, Edit, MoreVert } from "@mui/icons-material";
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
import Link from "next/link";
import { useTranslations } from "next-intl";

type ActionsCellProps = Cell<User>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const t = useTranslations("users.list");

  const handleActivate = async () => {
    try {
      setIsActivating(true);
      await usersService.activateUser(row.original.id);
      await queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate the users query to refresh the list
      toast({
        title: t("messages.userActivated"),
        description: t("messages.userActivatedDesc", {
          name: row.original.name,
        }),
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.errorActivating"),
          description:
            error.response?.data?.message || t("messages.actionError"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.errorActivating"),
          description:
            error instanceof Error
              ? error.message
              : t("messages.unexpectedError"),
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
        title: t("messages.userDeactivated"),
        description: t("messages.userDeactivatedDesc", {
          name: row.original.name,
        }),
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.errorDeactivating"),
          description:
            error.response?.data?.message || t("messages.actionError"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.errorDeactivating"),
          description:
            error instanceof Error
              ? error.message
              : t("messages.unexpectedError"),
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
        title: t("messages.userDeleted"),
        description: t("messages.userDeletedDesc", { name: row.original.name }),
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.errorDeleting"),
          description:
            error.response?.data?.message || t("messages.actionError"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.errorDeleting"),
          description:
            error instanceof Error
              ? error.message
              : t("messages.unexpectedError"),
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
      setShowAlert(false);
    }
  };

  if (row.original.status === "pending") {
    return <div className="flex gap-2"></div>;
  }

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
              <AlertDialogTitle>
                {t("confirmations.areYouSure")}
              </AlertDialogTitle>
              <AlertDialogX />

              <AlertDialogDescription>
                {t("confirmations.disableUser")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("confirmations.noCancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeactivate}>
                {t("confirmations.yesDisable")}
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
              <AlertDialogTitle>
                {t("confirmations.areYouSure")}
              </AlertDialogTitle>
              <AlertDialogX />
              <AlertDialogDescription>
                {t("confirmations.enableUser")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("confirmations.noCancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleActivate}>
                {t("confirmations.yesEnable")}
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
          <Link href={`/users/${row.original.id}/edit`}>
            <DropdownMenuItem>
              <Edit />
              {t("actions.edit")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            disabled={isDeleting}
            onClick={() => {
              setOpenDropdown(false); // close dropdown
              setShowAlert(true); // open alert
            }}
          >
            <Delete /> {t("actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDeleting && (
        <Button variant="ghost-destructive" disabled>
          <Spinner />
          {t("messages.deleting")}
        </Button>
      )}

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmations.areYouSure")}</AlertDialogTitle>
            <AlertDialogX />
            <AlertDialogDescription>
              {t("confirmations.deleteUser")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              {t("confirmations.noCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
              }}
            >
              {t("confirmations.yesDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsCell;
