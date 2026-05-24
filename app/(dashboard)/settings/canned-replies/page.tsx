"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { useSession } from "@/hooks/useSession";
import omnichannelService from "@/services/omnichannel.service";
import type { CannedReply } from "@/types/omnichannel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Add, Edit, DeleteOutline, Bolt, Warning } from "@mui/icons-material";
import { cn } from "@/lib/utils";

const inputClass = (hasError: boolean) =>
  cn(
    "w-full h-10 px-3 bg-white border rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all",
    hasError ? "border-red-300 bg-red-50/40" : "border-gray-200",
  );

const CannedRepliesPage = () => {
  const t = useTranslations("omnichannel.cannedReplies");
  const { data: session } = useSession();
  const isAdmin = session?.userType === "user";

  const [replies, setReplies] = useState<CannedReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Dialog state — `editing` null means create mode; a reply means edit.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CannedReply | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    setLoadError(false);
    omnichannelService
      .listCannedReplies()
      .then((rows) => setReplies(rows))
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (reply: CannedReply) => {
    setEditing(reply);
    setDialogOpen(true);
  };

  const handleDelete = async (reply: CannedReply) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    setDeletingId(reply.id);
    try {
      await omnichannelService.deleteCannedReply(reply.id);
      setReplies((prev) => prev.filter((r) => r.id !== reply.id));
    } catch {
      /* leave the row; a reload will resync */
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (saved: CannedReply) => {
    setReplies((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx === -1) return [...prev, saved].sort(byTitle);
      const next = [...prev];
      next[idx] = saved;
      return next.sort(byTitle);
    });
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-500 max-w-xl">{t("subtitle")}</p>
        </div>
        {isAdmin && (
          <Button className="gap-1.5 shrink-0" onClick={openCreate}>
            <Add className="!text-lg" />
            {t("new")}
          </Button>
        )}
      </div>

      {!isAdmin && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
          <Warning className="!text-sm shrink-0" />
          {t("adminOnly")}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : loadError ? (
        <div className="text-sm text-gray-400 py-8 text-center">
          {t("loadError")}
        </div>
      ) : replies.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 px-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center ring-8 ring-primary-50/40">
            <Bolt className="!text-2xl text-primary-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            {t("empty")}
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-xs">{t("emptyHint")}</p>
          {isAdmin && (
            <Button className="mt-5 gap-1.5" onClick={openCreate}>
              <Add className="!text-lg" />
              {t("new")}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="group flex items-start gap-3 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {reply.title}
                  </span>
                  {reply.shortcut && (
                    <span className="inline-flex items-center text-[11px] font-medium text-primary-600 bg-primary-50 ring-1 ring-primary-100 rounded-full px-2 h-5 shrink-0">
                      /{reply.shortcut}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 whitespace-pre-wrap">
                  {reply.contentEn || reply.contentAr}
                </p>
                {reply.contentEn && reply.contentAr && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-gray-400">
                    EN · AR
                  </span>
                )}
              </div>
              {isAdmin && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(reply)}
                    aria-label={t("edit")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <Edit className="!text-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(reply)}
                    disabled={deletingId === reply.id}
                    aria-label={t("delete")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    {deletingId === reply.id ? (
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-red-200 border-t-red-500 animate-spin" />
                    ) : (
                      <DeleteOutline className="!text-[18px]" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CannedReplyDialog
        open={dialogOpen}
        editing={editing}
        onOpenChange={setDialogOpen}
        onSaved={handleSaved}
      />
    </div>
  );
};

const byTitle = (a: CannedReply, b: CannedReply) =>
  a.title.localeCompare(b.title);

type DialogProps = {
  open: boolean;
  editing: CannedReply | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (reply: CannedReply) => void;
};

const CannedReplyDialog = ({
  open,
  editing,
  onOpenChange,
  onSaved,
}: DialogProps) => {
  const t = useTranslations("omnichannel.cannedReplies");
  const [title, setTitle] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Re-seed the form whenever the dialog opens for a different target.
  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setShortcut(editing?.shortcut ?? "");
    setContentEn(editing?.contentEn ?? "");
    setContentAr(editing?.contentAr ?? "");
    setError(null);
    setIsSaving(false);
  }, [open, editing]);

  // Need a title and at least one language filled in.
  const canSave =
    title.trim().length > 0 &&
    (contentEn.trim().length > 0 || contentAr.trim().length > 0);

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);
    const payload = {
      title: title.trim(),
      shortcut: shortcut.trim(),
      contentEn: contentEn.trim(),
      contentAr: contentAr.trim(),
    };
    try {
      const saved = editing
        ? await omnichannelService.updateCannedReply(editing.id, payload)
        : await omnichannelService.createCannedReply(payload);
      onSaved(saved);
    } catch (err: any) {
      setError(err?.response?.data?.error || t("saveError"));
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            {editing ? t("form.editTitle") : t("form.createTitle")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
              <Warning className="!text-sm text-red-400 mt-0.5 shrink-0" />
              <span className="text-xs text-red-600">{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              {t("form.titleLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("form.titlePlaceholder")}
              className={inputClass(false)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              {t("form.shortcutLabel")}
            </label>
            <div className="relative">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                /
              </span>
              <input
                type="text"
                value={shortcut}
                onChange={(e) =>
                  setShortcut(
                    e.target.value.replace(/^\/+/, "").replace(/\s+/g, ""),
                  )
                }
                placeholder={t("form.shortcutPlaceholder")}
                className={cn(inputClass(false), "ps-6")}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {t("form.shortcutHint")}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              {t("form.contentEnLabel")}
            </label>
            <textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              placeholder={t("form.contentPlaceholder")}
              rows={3}
              dir="ltr"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              {t("form.contentArLabel")}
            </label>
            <textarea
              value={contentAr}
              onChange={(e) => setContentAr(e.target.value)}
              placeholder={t("form.contentPlaceholder")}
              rows={3}
              dir="rtl"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              {t("form.contentHint")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {t("form.cancel")}
          </Button>
          <Button
            size="sm"
            className="text-xs gap-1.5"
            onClick={handleSave}
            disabled={!canSave || isSaving}
          >
            {isSaving ? (
              <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : null}
            {t("form.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CannedRepliesPage;
