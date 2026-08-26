"use client";

import { ArrowClockwise, CaretDown, Trash, UserPlus, UsersThree } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { RichfieldAdminMember, RichfieldAdminMembersContext, RichfieldAdminRole } from "@/lib/richfield-admin-members";
import { adminFetch } from "./richfield-admin-session-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MembersResponse = {
  context?: RichfieldAdminMembersContext;
  error?: string;
  message?: string;
  members?: RichfieldAdminMember[];
  roles?: RichfieldAdminRole[];
};

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
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState("");
  const [busy, setBusy] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RichfieldAdminMember | null>(null);

  const loadMembers = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      const response = await adminFetch("/api/admin/members", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as MembersResponse;
      if (!response.ok || !payload.members) throw new Error(payload.error ?? t("unavailable"));
      setMembers(payload.members);
      setRoles(payload.roles ?? []);
      setContext(payload.context ?? null);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t("unavailable"));
    }
  }, [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMembers(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMembers]);

  const invited = useMemo(() => members.filter((member) => member.status === "Invited"), [members]);
  const active = useMemo(() => members.filter((member) => member.status !== "Invited"), [members]);

  async function mutate(method: "DELETE" | "PATCH" | "POST", body: unknown, success: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await adminFetch("/api/admin/members", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method,
      });
      const payload = (await response.json().catch(() => ({}))) as MembersResponse;
      if (!response.ok) throw new Error(payload.error ?? payload.message ?? t("updateFailed"));
      await loadMembers();
      setMessage(success);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t("updateFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function invite() {
    const parsed = parseEmails(emails);
    if (parsed.length === 0) {
      setStatus("error");
      setMessage(t("validEmail"));
      return;
    }
    await mutate("POST", { emails: parsed }, t("inviteSuccess"));
    setEmails("");
  }

  async function remove(member: RichfieldAdminMember) {
    await mutate(
      "DELETE",
      member.status === "Invited" && member.email ? { email: member.email } : { id: member.id },
      t(member.status === "Invited" ? "inviteRemoved" : "accessRemoved"),
    );
    setRemoveTarget(null);
  }

  async function updateRole(
    member: RichfieldAdminMember,
    role: RichfieldAdminRole,
    enabled: boolean,
  ) {
    if (member.isCurrentUser) return;
    await mutate(
      "PATCH",
      { enabled, roleId: role.id, userId: member.id },
      t(enabled ? "accessLevelAdded" : "accessLevelRemoved"),
    );
  }

  return (
    <section className="grid min-w-0 gap-6">
      <Card className="border border-admin-rule bg-admin-panel py-0 shadow-none ring-0">
        <CardHeader className="gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-admin-clay/12 text-admin-clay"><UsersThree aria-hidden size={21} /></span>
            <div className="min-w-0">
              <CardTitle className="truncate font-display text-2xl text-admin-ink">{context?.boundProjectName ?? t("team")}</CardTitle>
              <p className="mt-1 text-sm leading-6 text-admin-ink-soft">{t("description")}</p>
            </div>
          </div>
          <Button className="h-10 rounded-lg" disabled={busy || status === "loading"} onClick={() => void loadMembers()} variant="outline">
            <ArrowClockwise aria-hidden data-icon="inline-start" />{t("refresh")}
          </Button>
        </CardHeader>
      </Card>

      <Card className="border border-admin-rule bg-admin-panel shadow-none ring-0">
        <CardHeader>
          <CardTitle className="font-display text-xl text-admin-ink">{t("inviteTitle")}</CardTitle>
          <p className="text-sm leading-6 text-admin-ink-soft">{t("inviteDescription")}</p>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <label className="grid gap-2">
            <span className="sr-only">{t("emails")}</span>
            <textarea
              className="min-h-24 resize-y rounded-xl border border-admin-rule bg-admin-surface px-3 py-2 text-sm text-admin-ink outline-none placeholder:text-admin-ink-soft/60 focus:border-admin-gold focus:ring-3 focus:ring-admin-gold/10 disabled:opacity-60"
              disabled={!context?.canManageMembers || busy}
              onChange={(event) => setEmails(event.currentTarget.value)}
              placeholder={t("invitePlaceholder")}
              value={emails}
            />
          </label>
          <Button className="h-11 rounded-xl bg-admin-navy text-white hover:bg-admin-copper" disabled={!context?.canManageMembers || busy} onClick={() => void invite()}>
            <UserPlus aria-hidden data-icon="inline-start" />{busy ? t("saving") : t("invite")}
          </Button>
        </CardContent>
      </Card>

      {message ? (
        <p className={`rounded-xl border px-4 py-3 text-sm ${status === "error" ? "border-red-500/25 bg-red-500/8 text-red-700 dark:text-red-300" : "border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"}`} role={status === "error" ? "alert" : "status"}>{message}</p>
      ) : null}

      {status === "loading" ? <MembersSkeleton label={t("loading")} /> : null}
      {status === "ready" && members.length === 0 ? <p className="rounded-xl border border-dashed border-admin-rule bg-admin-panel p-6 text-sm text-admin-ink-soft">{t("empty")}</p> : null}

      <MemberGroup accessLevelsLabel={t("accessLevels")} caption={t("activeCaption")} canManage={Boolean(context?.canManageMembers)} canManageRoles={Boolean(context?.canManageRoles)} members={active} onRemove={setRemoveTarget} onRoleChange={updateRole} removeLabel={t("removeMemberLabel")} roles={roles} selfRemovalLabel={t("selfRemovalLabel")} statusLabel={t("activeStatus")} title={t("activeTitle")} />
      <MemberGroup caption={t("invitedCaption")} canManage={Boolean(context?.canManageMembers)} members={invited} onRemove={setRemoveTarget} removeLabel={t("removeMemberLabel")} selfRemovalLabel={t("selfRemovalLabel")} statusLabel={t("invitedStatus")} title={t("invitedTitle")} />

      <AlertDialog onOpenChange={(open) => !open && setRemoveTarget(null)} open={Boolean(removeTarget)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t(removeTarget?.status === "Invited" ? "removeInviteTitle" : "removeAccessTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{removeTarget?.email ?? removeTarget?.name}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" disabled={busy || !removeTarget} onClick={() => removeTarget && void remove(removeTarget)}>{t("confirmRemove")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function MemberGroup({ accessLevelsLabel, caption, canManage, canManageRoles = false, members, onRemove, onRoleChange, removeLabel, roles = [], selfRemovalLabel, statusLabel, title }: { accessLevelsLabel?: string; caption: string; canManage: boolean; canManageRoles?: boolean; members: RichfieldAdminMember[]; onRemove: (member: RichfieldAdminMember) => void; onRoleChange?: (member: RichfieldAdminMember, role: RichfieldAdminRole, enabled: boolean) => Promise<void>; removeLabel: string; roles?: RichfieldAdminRole[]; selfRemovalLabel: string; statusLabel: string; title: string }) {
  if (members.length === 0) return null;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 className="font-display text-2xl leading-none text-admin-ink">{title}<span className="ml-2 text-base text-admin-ink-soft">{members.length}</span></h3><p className="text-sm text-admin-ink-soft">{caption}</p></div>
      <div className="grid gap-3 lg:grid-cols-2">
        {members.map((member) => (
          <Card className="border border-admin-rule bg-admin-panel py-4 shadow-none ring-0" key={member.id}>
            <CardContent className="grid gap-3 px-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-11" size="lg"><AvatarFallback className="bg-admin-navy font-display text-white">{member.initials}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><strong className="block truncate text-admin-ink">{member.name}</strong>{member.email && member.email !== member.name ? <span className="block truncate text-sm text-admin-ink-soft">{member.email}</span> : null}</div>
                <Button aria-label={`${removeLabel} ${member.name}`} className="text-red-600" disabled={!canManage || member.isCurrentUser} onClick={() => onRemove(member)} size="icon-sm" title={member.isCurrentUser ? selfRemovalLabel : undefined} variant="ghost"><Trash aria-hidden /></Button>
              </div>
              <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{statusLabel}</Badge>{member.roles.length > 0 ? member.roles.map((role) => <Badge key={role.id} variant="outline">{role.name}</Badge>) : <Badge variant="outline">{member.role}</Badge>}{roles.length > 0 && onRoleChange ? <RoleMenu accessLevelsLabel={accessLevelsLabel ?? "Access levels"} canManage={canManageRoles && !member.isCurrentUser} member={member} onRoleChange={onRoleChange} roles={roles} selfRemovalLabel={selfRemovalLabel} /> : null}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoleMenu({ accessLevelsLabel, canManage, member, onRoleChange, roles, selfRemovalLabel }: { accessLevelsLabel: string; canManage: boolean; member: RichfieldAdminMember; onRoleChange: (member: RichfieldAdminMember, role: RichfieldAdminRole, enabled: boolean) => Promise<void>; roles: RichfieldAdminRole[]; selfRemovalLabel: string }) {
  const assigned = new Set(member.roles.map((role) => role.id));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className="h-7 rounded-full px-2.5 text-xs" disabled={!canManage} title={member.isCurrentUser ? selfRemovalLabel : undefined} variant="outline" />}
      >
        {accessLevelsLabel}<CaretDown aria-hidden data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>{accessLevelsLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuCheckboxItem
            checked={assigned.has(role.id)}
            key={role.id}
            onCheckedChange={(checked) => void onRoleChange(member, role, checked === true)}
            onSelect={(event) => event.preventDefault()}
          >
            {role.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MembersSkeleton({ label }: { label: string }) {
  return <div aria-label={label} className="grid gap-3 sm:grid-cols-2">{[0, 1].map((item) => <div className="h-28 animate-pulse rounded-xl border border-admin-rule bg-admin-panel" key={item} />)}</div>;
}

function parseEmails(value: string) {
  return [...new Set(value.split(/[,;\n]/).map((email) => email.trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))];
}
