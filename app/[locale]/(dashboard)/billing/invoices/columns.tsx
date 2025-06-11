"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import billingService from "@/services/billing.service";
import { Download, MonetizationOn, Money } from "@mui/icons-material";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";

export type Invoice = {
  currencyCode: string;
  date: string;
  email: string;
  id: string;
  number: string;
  status: string;
  total: number;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "number",
    header: "#Ref-No",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      const currencyCode = row.original.currencyCode as string;
      return (
        <div className="flex flex-col items-center w-min font-normal">
          <p>{total}</p>
          <p className="text-gray-500">{currencyCode}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants: any = {
        paid: "success",
        overdue: "destructive",
        draft: "muted",
      };
      return (
        <div className="flex items-center gap-2">
          <Badge variant={variants[status] || "default"}>{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [isDownloading, setIsDownloading] = useState(false);

      const invoiceId = row.original.id;
      const status = row.original.status;

      const getInvoiceUrl = async () => {
        try {
          setIsLoading(true);
          const url = await billingService.getInvoiceUrl(invoiceId);
          window.open(url.toString(), "_blank");
        } catch (error) {
          if (error instanceof AxiosError) {
            toast({
              variant: "destructive",
              title: "Error fetching invoice URL",
              description:
                error.response?.data?.message || "An unknown error occurred.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description:
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred.",
            });
          }
        } finally {
          setIsLoading(false);
        }
      };

      const downloadFile = async () => {
        try {
          setIsDownloading(true);
          const url = await billingService.getInvoiceFileUrl(invoiceId);
          var link = document.createElement("a");
          link.href = url.toString();
          link.download = "file.pdf";
          link.click();
        } catch (error) {
          if (error instanceof AxiosError) {
            toast({
              variant: "destructive",
              title: "Error downloading invoice",
              description:
                error.response?.data?.message || "An unknown error occurred.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description:
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred.",
            });
          }
        } finally {
          setIsDownloading(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          {status === "overdue" && (
            <Button
              size="icon"
              variant="ghost-success"
              onClick={getInvoiceUrl}
              loading={isLoading}
            >
              <MonetizationOn className="h-4 w-4" />
            </Button>
          )}

          {["paid", "overdue"].includes(status) && (
            <Button
              size="icon"
              variant="ghost"
              onClick={downloadFile}
              loading={isDownloading}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
