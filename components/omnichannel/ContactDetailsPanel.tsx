"use client";

import { useEffect, useState } from "react";
import {
  Add,
  Close,
  Delete,
  Edit,
  History,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import omnichannelService from "@/services/omnichannel.service";
import { useTranslations } from "@/providers/TranslationProvider";
import useAuth from "@/hooks/useAuth";
import { channelLabels } from "./ChannelIcon";
import type { ContactNote, Conversation } from "@/types/omnichannel";

/**
 * Right-side details panel for the active chat. Property/value attribute
 * list at the top, then notes (org-wide). Tags section is wired visually
 * but not persisted — backend support lands later.
 *
 * Lives in the page grid (not a modal) — open/close is owned by the page
 * which mounts/unmounts this column. The X here just calls `onClose`.
 */
type Props = {
  conversation: Conversation;
  onClose: () => void;
};

/** First word of a name → first_name; everything after → last_name. We
 * don't store these as separate columns on contacts; this is purely a
 * display split so the attributes table reads like a CRM. */
function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const ContactDetailsPanel = ({ conversation, onClose }: Props) => {
  const t = useTranslations("omnichannel");
  const { data: auth } = useAuth();
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [isComposingNote, setIsComposingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contact = conversation.contact;

  // Fetch notes whenever the displayed contact changes. NOTE: `t` is
  // intentionally NOT in deps — next-intl returns a fresh function each
  // render and including it would loop the fetch indefinitely.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setDraft("");
    setIsComposingNote(false);
    omnichannelService
      .getContactNotes(contact.id)
      .then((rows) => {
        if (!cancelled) setNotes(rows);
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load notes");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [contact.id]);

  const handleAdd = async () => {
    const body = draft.trim();
    if (!body) return;
    setIsSubmitting(true);
    try {
      const note = await omnichannelService.addContactNote(contact.id, {
        body,
        authorName: auth?.user?.name ?? "Agent",
      });
      setNotes((prev) => [note, ...prev]);
      setDraft("");
      setIsComposingNote(false);
    } catch {
      toast.error(t("notes.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prev = notes;
    setNotes((rows) => rows.filter((r) => r.id !== id));
    try {
      await omnichannelService.deleteContactNote(contact.id, id);
    } catch {
      setNotes(prev);
      toast.error(t("notes.deleteError"));
    }
  };

  const { first, last } = splitName(contact.name);

  /** Display rows for the Attributes section. Order matches the reference
   * design as closely as the schema allows; fields we don't persist render
   * with an em-dash so the table still reads like a complete profile. */
  const attributes: Array<{ key: string; value: string | null | undefined }> = [
    { key: "first_name", value: first },
    { key: "last_name", value: last },
    { key: "phone_number", value: contact.phone },
    { key: "email", value: contact.email },
    { key: "channel", value: channelLabels[conversation.channel] },
    { key: "user_id", value: contact.id },
    { key: "status", value: t(`status.${conversation.status}`) },
    {
      key: "assigned_agent",
      value: conversation.assignedAgentName ?? conversation.assignedAgent,
    },
    {
      key: "last_interaction",
      value: conversation.lastMessageAt
        ? format(new Date(conversation.lastMessageAt), "MM/dd/yyyy, h:mm a")
        : null,
    },
    { key: "last_message", value: conversation.lastMessage },
  ];

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      {/* Compact header — just a close button. The name is rendered as
          first_name/last_name attributes below to match the spec. */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
        <h2 className="text-sm font-semibold text-gray-900">
          {t("contactDetails.title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label={t("contactDetails.close")}
        >
          <Close className="!text-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Tags ────────────────────────────────────────────────────── */}
        <Section
          title={t("tags.title")}
          right={
            <IconButton
              ariaLabel={t("tags.add")}
              icon={<Add className="!text-[16px]" />}
              disabled
              title={t("tags.comingSoon")}
            />
          }
        >
          <div className="text-[11px] text-gray-400 italic">
            {t("tags.empty")}
          </div>
        </Section>

        {/* ── Notes ───────────────────────────────────────────────────── */}
        <Section
          title={t("notes.title")}
          right={
            <div className="flex items-center gap-1">
              <IconButton
                ariaLabel={t("notes.recent")}
                icon={<History className="!text-[16px]" />}
                onClick={() => {
                  /* room for a separate history view later */
                }}
              />
              <IconButton
                ariaLabel={t("notes.add")}
                icon={<Add className="!text-[16px]" />}
                onClick={() => setIsComposingNote(true)}
              />
            </div>
          }
        >
          {isComposingNote && (
            <div className="mb-3 space-y-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t("notes.placeholder")}
                rows={3}
                className="text-sm resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDraft("");
                    setIsComposingNote(false);
                  }}
                >
                  {t("notes.cancel")}
                </Button>
                <Button
                  size="sm"
                  disabled={!draft.trim() || isSubmitting}
                  onClick={handleAdd}
                >
                  {isSubmitting ? t("notes.saving") : t("notes.add")}
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-[11px] text-gray-400 italic">
              {t("notes.loading")}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-[11px] text-gray-400 italic">
              {t("notes.empty")}
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="group p-2.5 rounded-lg bg-amber-50 border border-amber-100"
                >
                  <div className="flex items-center justify-between mb-1">
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
              ))}
            </div>
          )}
        </Section>

        {/* ── Attributes ─────────────────────────────────────────────── */}
        <Section
          title={t("attributes.title")}
          right={
            <IconButton
              ariaLabel={t("attributes.edit")}
              icon={<Edit className="!text-[16px]" />}
              disabled
              title={t("attributes.comingSoon")}
            />
          }
          last
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 pb-1.5 mb-1 border-b border-gray-100">
              <span>{t("attributes.name")}</span>
              <span>{t("attributes.value")}</span>
            </div>
            {attributes.map(({ key, value }) => (
              <div
                key={key}
                className="flex items-start justify-between gap-3 py-1 text-[12px]"
              >
                <span className="text-gray-500 font-mono shrink-0">{key}</span>
                <span
                  className={
                    value
                      ? "text-gray-800 text-end break-words"
                      : "text-gray-300 text-end"
                  }
                >
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

/** Reusable section header + body wrapper. Keeps padding/borders
 * consistent across Tags / Notes / Attributes without three near-identical
 * blocks inline. */
function Section({
  title,
  right,
  children,
  last,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={
        last ? "px-5 py-4" : "px-5 py-4 border-b border-gray-100"
      }
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold text-primary-600">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function IconButton({
  ariaLabel,
  icon,
  onClick,
  disabled,
  title,
}: {
  ariaLabel: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-primary-500 hover:bg-primary-50 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
    >
      {icon}
    </button>
  );
}

export default ContactDetailsPanel;
