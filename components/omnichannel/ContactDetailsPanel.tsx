"use client";

import { useEffect, useRef, useState } from "react";
import { Add, Close, Delete } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import omnichannelService from "@/services/omnichannel.service";
import { useTranslations } from "@/providers/TranslationProvider";
import useAuth from "@/hooks/useAuth";
import { channelLabels } from "./ChannelIcon";
import { cn } from "@/lib/utils";
import type { ContactNote, Conversation, Tag } from "@/types/omnichannel";

/** Pleasant tag chip colors used when the server didn't store one. The
 * agent picks via name hash so the same tag name renders the same color
 * across surfaces (panel + row + filter). */
const TAG_PALETTE = [
  { bg: "bg-rose-100", fg: "text-rose-700", border: "border-rose-200" },
  { bg: "bg-amber-100", fg: "text-amber-700", border: "border-amber-200" },
  { bg: "bg-emerald-100", fg: "text-emerald-700", border: "border-emerald-200" },
  { bg: "bg-sky-100", fg: "text-sky-700", border: "border-sky-200" },
  { bg: "bg-violet-100", fg: "text-violet-700", border: "border-violet-200" },
  { bg: "bg-pink-100", fg: "text-pink-700", border: "border-pink-200" },
];

function paletteForTag(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[hash % TAG_PALETTE.length]!;
}

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
  /** Pushed up so the page can reflect tag changes on the list row /
   * selected conversation without waiting for the next poll tick. */
  onTagsChanged?: (tags: Tag[]) => void;
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

const ContactDetailsPanel = ({
  conversation,
  onClose,
  onTagsChanged,
}: Props) => {
  const t = useTranslations("omnichannel");
  const { data: auth } = useAuth();
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [isComposingNote, setIsComposingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contact = conversation.contact;

  // ── Tags ───────────────────────────────────────────────────────────────
  // Local tag list mirrors `conversation.tags` so optimistic add/remove
  // shows immediately. Suggestions come from `listTags` (cached for the
  // panel's lifetime) so the agent gets autocomplete + can pick a tag
  // they've used before.
  const [convTags, setConvTags] = useState<Tag[]>(conversation.tags ?? []);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [isComposingTag, setIsComposingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  // Re-sync local tag state when the parent swaps to a different
  // conversation (or the same conversation polls back with mutated tags).
  useEffect(() => {
    setConvTags(conversation.tags ?? []);
  }, [conversation.id, conversation.tags]);

  // Load all org tags once the panel mounts. Refetched if the panel
  // re-mounts (open → close → open) so a teammate's new tag shows up.
  useEffect(() => {
    let cancelled = false;
    omnichannelService
      .listTags()
      .then((rows) => {
        if (!cancelled) setAllTags(rows);
      })
      .catch(() => {
        /* ignore — suggestions just won't appear */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddTag = async (input: string) => {
    const name = input.trim();
    if (!name) return;
    // Skip if already attached (case-insensitive).
    if (convTags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setTagDraft("");
      setIsComposingTag(false);
      return;
    }
    try {
      const tag = await omnichannelService.attachTag(conversation.id, { name });
      // Replace any earlier optimistic entry with the same name so we
      // don't end up with both an inline placeholder and the real row.
      // NOTE: `onTagsChanged` is called *outside* the setState updater —
      // calling a parent setState from inside an updater function fires
      // during render and trips "Cannot update a component while
      // rendering a different component."
      const next = [
        ...convTags.filter(
          (t) => t.name.toLowerCase() !== name.toLowerCase(),
        ),
        tag,
      ];
      setConvTags(next);
      onTagsChanged?.(next);
      // Cache the new tag in suggestions so it shows up immediately.
      setAllTags((prev) =>
        prev.some((t) => t.id === tag.id) ? prev : [...prev, tag],
      );
      setTagDraft("");
      setIsComposingTag(false);
    } catch {
      toast.error(t("tags.saveError"));
    }
  };

  const handleRemoveTag = async (tag: Tag) => {
    const prev = convTags;
    const next = convTags.filter((tg) => tg.id !== tag.id);
    setConvTags(next);
    onTagsChanged?.(next);
    try {
      await omnichannelService.detachTag(conversation.id, tag.id);
    } catch {
      setConvTags(prev);
      onTagsChanged?.(prev);
      toast.error(t("tags.deleteError"));
    }
  };

  // Suggestions = org tags that aren't already attached to this
  // conversation and match the current input.
  const tagSuggestions = (() => {
    const attached = new Set(convTags.map((t) => t.id));
    const q = tagDraft.trim().toLowerCase();
    return allTags
      .filter((t) => !attached.has(t.id))
      .filter((t) => !q || t.name.toLowerCase().includes(q))
      .slice(0, 6);
  })();

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
              onClick={() => {
                setIsComposingTag(true);
                // Defer focus to the next paint so the input has mounted.
                setTimeout(() => tagInputRef.current?.focus(), 0);
              }}
            />
          }
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {convTags.map((tag) => {
              const palette = paletteForTag(tag.name);
              return (
                <span
                  key={tag.id}
                  className={cn(
                    "inline-flex items-center gap-1 h-6 ps-2 pe-1 rounded-full text-[11px] font-medium border",
                    palette.bg,
                    palette.fg,
                    palette.border,
                  )}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={t("tags.remove", { name: tag.name })}
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10"
                  >
                    <Close className="!text-[10px]" />
                  </button>
                </span>
              );
            })}
            {!isComposingTag && convTags.length === 0 && (
              <span className="text-[11px] text-gray-400 italic">
                {t("tags.empty")}
              </span>
            )}
          </div>

          {isComposingTag && (
            <div className="relative mt-2">
              <input
                ref={tagInputRef}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleAddTag(tagDraft);
                  } else if (e.key === "Escape") {
                    setTagDraft("");
                    setIsComposingTag(false);
                  }
                }}
                onBlur={() => {
                  // Small delay so a click on a suggestion fires before
                  // we close the menu.
                  setTimeout(() => {
                    setIsComposingTag(false);
                    setTagDraft("");
                  }, 150);
                }}
                placeholder={t("tags.placeholder")}
                className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
              {tagSuggestions.length > 0 && (
                <ul className="absolute top-full mt-1 start-0 end-0 z-10 bg-white border border-gray-200 rounded-lg shadow-sm max-h-40 overflow-y-auto">
                  {tagSuggestions.map((tag) => {
                    const palette = paletteForTag(tag.name);
                    return (
                      <li key={tag.id}>
                        <button
                          type="button"
                          // Use mousedown so the click fires before the
                          // input's onBlur closes the picker.
                          onMouseDown={(e) => {
                            e.preventDefault();
                            void handleAddTag(tag.name);
                          }}
                          className="w-full text-start px-2.5 py-1.5 text-[12px] hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span
                            className={cn(
                              "inline-block w-2 h-2 rounded-full",
                              palette.bg,
                            )}
                          />
                          {tag.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </Section>

        {/* ── Notes ───────────────────────────────────────────────────── */}
        <Section
          title={t("notes.title")}
          right={
            <IconButton
              ariaLabel={t("notes.add")}
              icon={<Add className="!text-[16px]" />}
              onClick={() => setIsComposingNote(true)}
            />
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
        <Section title={t("attributes.title")} last>
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
