"use client";

import { ArrowClockwise, CaretDown, FunnelSimple, MagnifyingGlass, SlidersHorizontal, Trash, UserPlus, UsersThree } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { RichfieldAdminMember, RichfieldAdminMembersContext, RichfieldAdminRole } from "@/lib/richfield-admin-members";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminFetch } from "./richfield-admin-session-client";

type MembersResponse = { context?: RichfieldAdminMembersContext; error?: string; message?: string; members?: RichfieldAdminMember[]; roles?: RichfieldAdminRole[] };
type Sort = "name-asc" | "name-desc";

export function getInitials(email: string | null) {
  if (!email) return "R";
  const [name] = email.split("@");
  return name?.split(/[._-]+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "R";
}

export function MembersPanel({ membersHref: _membersHref }: { membersHref?: string }) {
  const t = useTranslations("admin.members");
  const [members, setMembers] = useState<RichfieldAdminMember[]>([]);
  const [roles, setRoles] = useState<RichfieldAdminRole[]>([]);
  const [context, setContext] = useState<RichfieldAdminMembersContext | null>(null);
  const [status, setStatus] = useState<"error" | "loading" | "ready">("loading");
  const [loadError, setLoadError] = useState("");
  const [emails, setEmails] = useState("");
  const [busy, setBusy] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RichfieldAdminMember | null>(null);
  const [accessMemberId, setAccessMemberId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("name-asc");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadMembers = useCallback(async (background = false) => {
    if (!background) setStatus("loading");
    setLoadError("");
    try {
      const response = await adminFetch("/api/admin/members", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as MembersResponse;
      if (!response.ok || !payload.members) throw new Error(payload.error ?? t("unavailable"));
      setMembers(payload.members); setRoles(payload.roles ?? []); setContext(payload.context ?? null); setStatus("ready");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("unavailable");
      if (background) toast.error(errorMessage);
      else { setStatus("error"); setLoadError(errorMessage); }
    }
  }, [t]);

  useEffect(() => { const timer = window.setTimeout(() => void loadMembers(), 0); return () => window.clearTimeout(timer); }, [loadMembers]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return members
      .filter((member) => (!needle || `${member.name} ${member.email ?? ""} ${member.roles.map((role) => role.name).join(" ")}`.toLowerCase().includes(needle)) && (roleFilter === "all" || member.roles.some((role) => role.id === roleFilter)))
      .sort((a, b) => (sort === "name-asc" ? 1 : -1) * a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  }, [members, roleFilter, search, sort]);
  const invited = filtered.filter((member) => member.status === "Invited");
  const active = filtered.filter((member) => member.status !== "Invited");
  const accessMember = members.find((member) => member.id === accessMemberId) ?? null;

  async function mutate(method: "DELETE" | "PATCH" | "POST", body: unknown, success: string) {
    setBusy(true);
    try {
      const response = await adminFetch("/api/admin/members", { body: JSON.stringify(body), headers: { "Content-Type": "application/json" }, method });
      const payload = (await response.json().catch(() => ({}))) as MembersResponse;
      if (!response.ok) throw new Error(payload.error ?? payload.message ?? t("updateFailed"));
      await loadMembers(true); toast.success(success); return true;
    } catch (error) { toast.error(error instanceof Error ? error.message : t("updateFailed")); return false; }
    finally { setBusy(false); }
  }

  async function invite() {
    const parsed = parseEmails(emails);
    if (parsed.length === 0) { toast.error(t("validEmail")); return; }
    if (await mutate("POST", { emails: parsed }, t("inviteSuccess"))) { setEmails(""); setInviteOpen(false); }
  }
  async function remove(member: RichfieldAdminMember) { await mutate("DELETE", member.status === "Invited" && member.email ? { email: member.email } : { id: member.id }, t(member.status === "Invited" ? "inviteRemoved" : "accessRemoved")); setRemoveTarget(null); }
  async function updateRole(role: RichfieldAdminRole, enabled: boolean) { if (!accessMember || accessMember.isCurrentUser) return; await mutate("PATCH", { enabled, roleId: role.id, userId: accessMember.id }, t(enabled ? "accessLevelAdded" : "accessLevelRemoved")); }

  return <section className="grid min-w-0 gap-6">
    <Card className="border border-admin-rule bg-admin-panel py-0 shadow-none ring-0"><CardHeader className="gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"><div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-admin-clay/12 text-admin-clay"><UsersThree aria-hidden size={21} /></span><div className="min-w-0"><CardTitle className="truncate font-display text-2xl text-admin-ink">{context?.boundProjectName ?? t("team")}</CardTitle><p className="mt-1 text-sm leading-6 text-admin-ink-soft">{t("description")}</p></div></div><div className="flex flex-wrap gap-2"><Button disabled={busy || status === "loading"} onClick={() => void loadMembers()} variant="outline"><ArrowClockwise aria-hidden data-icon="inline-start" />{t("refresh")}</Button><Button className="bg-admin-navy text-white hover:bg-admin-copper" disabled={!context?.canManageMembers || busy} onClick={() => setInviteOpen(true)}><UserPlus aria-hidden data-icon="inline-start" />{t("invite")}</Button></div></CardHeader></Card>

    <div className="grid gap-3 rounded-2xl border border-admin-rule bg-admin-panel p-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,.35fr)_minmax(10rem,.35fr)]"><label className="relative"><span className="sr-only">{t("search")}</span><MagnifyingGlass aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-ink-soft" /><input className="min-h-11 w-full rounded-xl border border-admin-rule bg-admin-surface pl-10 pr-3 text-sm text-admin-ink outline-none focus:border-admin-gold" onChange={(event) => setSearch(event.currentTarget.value)} placeholder={t("searchPlaceholder")} type="search" value={search} /></label><label className="relative"><span className="sr-only">{t("sort")}</span><SlidersHorizontal aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-clay" /><select className="min-h-11 w-full appearance-none rounded-xl border border-admin-rule bg-admin-surface pl-10 pr-3 text-sm text-admin-ink" onChange={(event) => setSort(event.currentTarget.value as Sort)} value={sort}><option value="name-asc">{t("nameAsc")}</option><option value="name-desc">{t("nameDesc")}</option></select></label><label className="relative"><span className="sr-only">{t("filterRole")}</span><FunnelSimple aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-clay" /><select className="min-h-11 w-full appearance-none rounded-xl border border-admin-rule bg-admin-surface pl-10 pr-3 text-sm text-admin-ink" onChange={(event) => setRoleFilter(event.currentTarget.value)} value={roleFilter}><option value="all">{t("allAccessLevels")}</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label></div>

    {loadError ? <p className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">{loadError}</p> : null}
    {status === "loading" ? <MembersSkeleton label={t("loading")} /> : null}
    {status === "ready" && members.length === 0 ? <p className="rounded-xl border border-dashed border-admin-rule bg-admin-panel p-6 text-sm text-admin-ink-soft">{t("empty")}</p> : null}
    {status === "ready" && members.length > 0 && filtered.length === 0 ? <p className="rounded-xl border border-dashed border-admin-rule bg-admin-panel p-6 text-sm text-admin-ink-soft">{t("noMatches")}</p> : null}
    <MemberGroup accessLevelsLabel={t("accessLevels")} caption={t("activeCaption")} canManage={Boolean(context?.canManageMembers)} canManageRoles={Boolean(context?.canManageRoles)} members={active} onAccess={setAccessMemberId} onRemove={setRemoveTarget} removeLabel={t("removeMemberLabel")} selfRemovalLabel={t("selfRemovalLabel")} title={t("activeTitle")} />
    <MemberGroup caption={t("invitedCaption")} canManage={Boolean(context?.canManageMembers)} members={invited} onAccess={setAccessMemberId} onRemove={setRemoveTarget} removeLabel={t("removeMemberLabel")} selfRemovalLabel={t("selfRemovalLabel")} title={t("invitedTitle")} />

    <Dialog onOpenChange={setInviteOpen} open={inviteOpen}><DialogContent><DialogHeader><DialogTitle>{t("inviteTitle")}</DialogTitle><DialogDescription>{t("inviteDescription")}</DialogDescription></DialogHeader><label className="grid gap-2"><span className="text-xs font-bold uppercase tracking-wider text-admin-ink-soft">{t("emails")}</span><textarea autoFocus className="min-h-32 resize-y rounded-xl border border-admin-rule bg-admin-surface px-3 py-3 text-sm text-admin-ink outline-none placeholder:text-admin-ink-soft/60 focus:border-admin-gold focus:ring-3 focus:ring-admin-gold/10" disabled={busy} onChange={(event) => setEmails(event.currentTarget.value)} placeholder={t("invitePlaceholder")} value={emails} /></label><DialogFooter><DialogClose disabled={busy}>{t("cancel")}</DialogClose><Button className="bg-admin-navy text-white hover:bg-admin-copper" disabled={busy} onClick={() => void invite()}>{busy ? t("saving") : t("invite")}</Button></DialogFooter></DialogContent></Dialog>
    <Dialog onOpenChange={(open) => !open && setAccessMemberId(null)} open={Boolean(accessMember)}><DialogContent><DialogHeader><DialogTitle>{t("accessLevels")}</DialogTitle><DialogDescription>{accessMember?.email ?? accessMember?.name}</DialogDescription></DialogHeader><div className="grid gap-2">{roles.map((role) => { const checked = accessMember?.roles.some((assigned) => assigned.id === role.id) ?? false; return <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-admin-rule bg-admin-surface px-4 py-3 text-sm font-medium hover:border-admin-gold" key={role.id}><span>{role.name}</span><input checked={checked} className="size-4 accent-admin-navy" disabled={busy || Boolean(accessMember?.isCurrentUser)} onChange={(event) => void updateRole(role, event.currentTarget.checked)} type="checkbox" /></label>; })}</div><DialogFooter><DialogClose>{t("done")}</DialogClose></DialogFooter></DialogContent></Dialog>
    <AlertDialog onOpenChange={(open) => !open && setRemoveTarget(null)} open={Boolean(removeTarget)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t(removeTarget?.status === "Invited" ? "removeInviteTitle" : "removeAccessTitle")}</AlertDialogTitle><AlertDialogDescription>{removeTarget?.email ?? removeTarget?.name}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>{t("cancel")}</AlertDialogCancel><AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" disabled={busy || !removeTarget} onClick={() => removeTarget && void remove(removeTarget)}>{t("confirmRemove")}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </section>;
}

function MemberGroup({ accessLevelsLabel, caption, canManage, canManageRoles = false, members, onAccess, onRemove, removeLabel, selfRemovalLabel, title }: { accessLevelsLabel?: string; caption: string; canManage: boolean; canManageRoles?: boolean; members: RichfieldAdminMember[]; onAccess: (id: string) => void; onRemove: (member: RichfieldAdminMember) => void; removeLabel: string; selfRemovalLabel: string; title: string }) {
  if (members.length === 0) return null;
  return <div className="grid gap-3"><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 className="font-display text-2xl leading-none text-admin-ink">{title}<span className="ml-2 text-base text-admin-ink-soft">{members.length}</span></h3><p className="text-sm text-admin-ink-soft">{caption}</p></div><div className="grid gap-3 lg:grid-cols-2">{members.map((member) => { const roleLabel = member.roles.map((role) => role.name).join(", ") || member.role; return <Card className="border border-admin-rule bg-admin-panel py-4 shadow-none ring-0" key={member.id}><CardContent className="grid gap-3 px-4"><div className="flex min-w-0 items-center gap-3"><Avatar className="size-11" size="lg"><AvatarFallback className="bg-admin-navy font-display text-white">{member.initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><strong className="block truncate text-admin-ink">{member.name}</strong>{member.email && member.email !== member.name ? <span className="block truncate text-sm text-admin-ink-soft">{member.email}</span> : null}</div><Button aria-label={`${removeLabel} ${member.name}`} className="text-red-600" disabled={!canManage || member.isCurrentUser} onClick={() => onRemove(member)} size="icon-sm" title={member.isCurrentUser ? selfRemovalLabel : undefined} variant="ghost"><Trash aria-hidden /></Button></div>{accessLevelsLabel && member.status !== "Invited" ? canManageRoles ? <Button aria-label={`${accessLevelsLabel}: ${member.name}`} className="h-9 w-fit max-w-full rounded-full border-admin-gold/35 bg-admin-gold/8 px-3 text-xs text-admin-ink hover:bg-admin-gold/15" disabled={member.isCurrentUser} onClick={() => onAccess(member.id)} title={member.isCurrentUser ? selfRemovalLabel : undefined} variant="outline"><SlidersHorizontal aria-hidden data-icon="inline-start" /><span className="truncate">{roleLabel}</span><CaretDown aria-hidden data-icon="inline-end" /></Button> : <span className="inline-flex h-8 w-fit max-w-full items-center rounded-full border border-admin-gold/35 bg-admin-gold/8 px-3 text-xs font-semibold text-admin-ink"><span className="truncate">{roleLabel}</span></span> : null}</CardContent></Card>; })}</div></div>;
}

function MembersSkeleton({ label }: { label: string }) { return <div aria-label={label} className="grid gap-3 sm:grid-cols-2">{[0, 1].map((item) => <div className="h-28 animate-pulse rounded-xl border border-admin-rule bg-admin-panel" key={item} />)}</div>; }
function parseEmails(value: string) { return [...new Set(value.split(/[,;\n]/).map((email) => email.trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))]; }
