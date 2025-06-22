"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WavesurferPlayer from "@wavesurfer/react";
import { useToast } from "@/hooks/use-toast";
import callReportingService from "@/services/call-reporting.service";
import { Call } from "@/types/api/call-reporting";
import { Info, PlayCircle } from "@mui/icons-material";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import SoundPlayer from "@/components/SoundPlayer";

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.to.name}</p>
        <p className="text-gray-500">{row.original.to.number}</p>
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.from.name}</p>
        <p className="text-gray-500">{row.original.from.number}</p>
      </div>
    ),
  },
  {
    accessorKey: "datetime",
    header: "Call Date",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.datetime.date}</p>
        <p className="text-gray-500">{row.original.datetime.time}</p>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Call Duration",
  },
  {
    accessorKey: "call_status",
    header: "Call Status",
    cell: ({ row }) => {
      const status = row.getValue("call_status") as string;

      if (status === "Answered") {
        return (
          <Badge variant="success" className="capitalize">
            {status}
          </Badge>
        );
      }
      if (status === "Busy") {
        return (
          <Badge variant="warning" className="capitalize">
            {status}
          </Badge>
        );
      }
      if (status === "Failed") {
        return (
          <Badge variant="destructive" className="capitalize">
            {status}
          </Badge>
        );
      }
      if (status === "Not Answered") {
        return (
          <Badge variant="muted" className="capitalize">
            {status}
          </Badge>
        );
      }
      return (
        <Badge variant="default" className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "direction",
    header: "Call Direction",
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("direction") === "outgoing" ? "success" : "muted"}
        className="capitalize"
      >
        {row.getValue("direction")}
      </Badge>
    ),
  },
  {
    accessorKey: "callSummary",
    header: "Call Summary",
    cell: ({ row }) => {
      const summary = row.original.callSummary;
      return (
        <div className="call-summary-cell">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Call Summary</DialogTitle>
              <div className="flex flex-col gap-2">
                {summary?.postCallTags && (
                  <div className="flex flex-wrap gap-1">
                    {summary.postCallTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {summary?.comment && (
                  <p className="text-sm text-gray-700">{summary.comment}</p>
                )}
                {summary?.addedBy && (
                  <p className="text-xs text-gray-500">
                    Added by: {summary.addedBy}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "recording",
    header: "Recording",
    cell: ({ row }) => {
      const hasRecording = row.original.hasRecording;
      const callId = row.original.id;
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
      const recordingFileName = useMemo(() => {
        if (recordingUrl) {
          const urlParts = recordingUrl.split("/");
          return urlParts[urlParts.length - 1];
        }
        return null;
      }, [recordingUrl]);

      const getRecording = async (callId: string) => {
        try {
          setIsLoading(true);
          const recordingUrl = await callReportingService.getCallRecording(
            callId
          );
          setRecordingUrl(recordingUrl);
          setIsModalOpen(true);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch recording. Please try again later.",
            variant: "destructive",
          });
          console.error("Error fetching recording:", error);
        } finally {
          setIsLoading(false);
        }
      };
      return (
        hasRecording && (
          <>
            <Button
              size="icon"
              variant="ghost-success"
              onClick={() => getRecording(callId)}
              loading={isLoading}
            >
              <PlayCircle />
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogTitle>Call Recording</DialogTitle>
                {recordingUrl && (
                  <SoundPlayer label={recordingFileName} url={recordingUrl} />
                )}
              </DialogContent>
            </Dialog>
          </>
        )
      );
    },
  },
];
