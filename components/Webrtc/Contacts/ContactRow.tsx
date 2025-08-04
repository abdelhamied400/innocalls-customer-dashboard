import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouting } from "@/providers/RoutingProvider";
import { useSip } from "@/providers/webrtc/SipProvider";
import webrtcService from "@/services/webrtc.service";
import { Call, DeleteForever, Edit, MoreVert } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";

type ContactRowProps = {
  contact: {
    id: string;
    name: string;
    phone: string;
  };
};

const ContactRow = ({ contact }: ContactRowProps) => {
  const t = useTranslations("webrtc.contacts");

  const { toast } = useToast();
  const { navigate } = useRouting();
  const { call } = useSip();
  const queryClient = useQueryClient();

  const handleStartCall = () => {
    if (!contact.phone) {
      toast({
        title: t("messages.error"),
        description: t("form.validation.phone.required"),
        variant: "destructive",
      });
      return;
    }
    call(contact.phone);
    toast({
      title: t("actions.calling"),
      description: t("messages.callingDescription", {
        name: contact.name,
        phone: contact.phone,
      }),
      variant: "success",
    });
  };

  const handleEditContact = () => {
    navigate(`/contacts/update/${contact.id}`);
  };

  const handleDeleteContact = async () => {
    // Implement delete contact functionality here
    try {
      await webrtcService.deleteContact(contact.id);
      await queryClient.invalidateQueries({
        queryKey: ["contacts-list"],
      });
      toast({
        title: t("messages.contactDeleted"),
        description: t("messages.contactDeletedDescription", {
          name: contact.name,
        }),
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.error"),
          description:
            error.response?.data?.message ||
            t("messages.failedToDeleteContact"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.error"),
          description: t("messages.unexpectedError"),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="contact-row">
      <div className="flex items-center justify-between gap-2 bg-gray-200 p-2 rounded-lg">
        <div className="details">
          <span className="text-sm font-medium truncate max-w-[120px] block">
            {contact.name}
          </span>
          <span className="text-sm font-medium truncate max-w-[120px] block">
            {contact.phone}
          </span>
        </div>
        <div className="actions flex items-center gap-2">
          <Button
            onClick={handleStartCall}
            size="icon"
            variant="ghost-primary"
            className="rounded-full"
          >
            <Call />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost-primary"
                className="rounded-full"
              >
                <MoreVert />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={handleEditContact}>
                <Edit /> {t("actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteContact}>
                <DeleteForever /> {t("actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ContactRow;
