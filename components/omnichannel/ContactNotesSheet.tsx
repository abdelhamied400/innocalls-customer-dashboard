"use client";

import { useEffect, useState } from "react";
import { Close, Delete } from "@mui/icons-material";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import omnichannelService from "@/services/omnichannel.service";
import { useTranslations } from "@/providers/TranslationProvider";
import useAuth from "@/hooks/useAuth";
import type { ContactNote } from "@/types/omnichannel";

/**
 * Org-wide notes attached to a contact. Trigger sits in <ChatHeader>;
 * clicking opens a right-side sheet with the full list + a textarea to add
 * a new note. Notes are mutated via the omnichannel service and survive
 * across agents — different from conversation favorites which are per-user.
 */
type Props = {
  contactId: string;
  contactName: string;
  trigger: React.ReactNode;
};

const ContactNotesSheet = ({ contactId, contactName, trigger }: Props) => {
  const t = useTranslations("omnichannel");
  const { data: auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch on open. Closing-then-reopening refetches so a teammate's note
  // written elsewhere shows up without us implementing a notes-specific
  // poll. Cheap enough.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setIsLoading(true);
    omnichannelService
      .getContactNotes(contactId)
      .then((rows) => {
        if (!cancelled) setNotes(rows);
      })
      .catch(() => {
        if (!cancelled) toast.error(t("notes.loadError"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, contactId, t]);

  const handleAdd = async () => {
    const body = draft.trim();
    if (!body) return;
    setIsSubmitting(true);
    try {
      const note = await omnichannelService.addContactNote(contactId, {
        body,
        authorName: auth?.user?.name ?? "Agent",
      });
      setNotes((prev) => [note, ...prev]);
      setDraft("");
    } catch {
      toast.error(t("notes.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic remove; restore on failure.
    const prev = notes;
    setNotes((rows) => rows.filter((r) => r.id !== id));
    try {
      await omnichannelService.deleteContactNote(contactId, id);
    } catch {
      setNotes(prev);
      toast.error(t("notes.deleteError"));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b border-gray-100">
          <SheetTitle className="text-sm font-semibold text-gray-900">
            {t("notes.title")}
          </SheetTitle>
          <p className="text-xs text-gray-500 mt-0.5">
            {t("notes.subtitle", { name: contactName })}
          </p>
        </SheetHeader>

        <div className="px-5 py-3 border-b border-gray-100">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("notes.placeholder")}
            rows={3}
            className="text-sm resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              disabled={!draft.trim() || isSubmitting}
              onClick={handleAdd}
            >
              {isSubmitting ? t("notes.saving") : t("notes.add")}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {isLoading ? (
            <div className="text-center text-xs text-gray-400 py-8">
              {t("notes.loading")}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center text-xs text-gray-400 py-8">
              {t("notes.empty")}
            </div>
          ) : (
            notes.map((n) => (
              <div
                key={n.id}
                className="group p-3 rounded-lg bg-amber-50 border border-amber-100"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-amber-700">
                    {n.authorName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-600/70">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      aria-label={t("notes.delete")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-700/70 hover:text-red-500"
                    >
                      <Delete className="!text-[14px]" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-amber-900 whitespace-pre-wrap">
                  {n.body}
                </p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContactNotesSheet;
