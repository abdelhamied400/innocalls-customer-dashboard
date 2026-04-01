"use client";
import { CallBridge } from "@/types/callBridge";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { Visibility } from "@mui/icons-material";
import Link from "next/link";

type ActionsCellProps = Cell<CallBridge>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost-primary" size="icon" asChild>
        <Link href={`/call-bridge/${row.original.id}`}>
          <Visibility fontSize="small" />
        </Link>
      </Button>
    </div>
  );
};

export default ActionsCell;
