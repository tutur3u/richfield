"use client";

import Link from "next/link";
import { ArrowSquareOut, UserPlus, UsersThree } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type {
  RichfieldAdminMember,
  RichfieldAdminMembersContext,
} from "@/lib/richfield-admin-members";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";
import { adminFetch } from "./richfield-admin-session-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MembersResponse = {
  context?: RichfieldAdminMembersContext;
  error?: string;
  members?: RichfieldAdminMember[];
};

/**
 * Initials for the account avatar.
 *
 * Lives here because it is the same idea as the member avatars below, even
 * though the dashboard header is its only other caller.
 */
export function getInitials(email: string | null) {
  if (!email) return "R";

  const [name] = email.split("@");
  const initials =
    name
      ?.split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2) ?? "";

  return initials.toUpperCase() || "R";
}

function MemberCard({ member }: { member: RichfieldAdminMember }) {
  const invited = member.status === "Invited";

  return (
    <Card className="gap-3 border border-admin-rule bg-admin-panel py-4 shadow-none ring-0">
      <CardContent className="grid min-w-0 gap-3 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-11" size="lg">
          <AvatarFallback
            className={
              invited
                ? "border border-dashed border-admin-rule bg-admin-surface text-admin-ink-soft"
                : "bg-admin-navy font-display text-white"
            }
          >
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <strong className="block truncate text-admin-ink">{member.name}</strong>
          {/* Someone who has not accepted yet has no display name, so name
              falls back to their email — printing both just repeats it. */}
          {member.email && member.email !== member.name ? (
            <span className="mt-0.5 block truncate text-sm text-admin-ink-soft">
              {member.email}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          className={`uppercase tracking-[0.08em] ${
            invited
              ? "border-admin-gold/35 bg-admin-gold/10 text-admin-gold"
              : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          }`}
          variant="outline"
        >
          {member.status}
        </Badge>
        <Badge className="border-admin-rule text-admin-ink-soft" variant="outline">
          {member.role}
        </Badge>
      </div>
      </CardContent>
    </Card>
  );
}

/** A titled run of member cards, with its own count. */
function MemberGroup({
  caption,
  members,
  title,
}: {
  caption: string;
  members: RichfieldAdminMember[];
  title: string;
}) {
  if (members.length === 0) return null;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-2xl leading-none text-ink">
          {title}
          <span className="ml-2 align-middle text-base text-muted">
            {members.length}
          </span>
        </h3>
        <p className="text-sm text-muted">{caption}</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

/**
 * Who can edit the site.
 *
 * Invited people are listed alongside active ones rather than hidden: an
 * invitation that was sent but never accepted is the usual reason someone says
 * they cannot get in, and a roster that silently omits them gives no way to
 * notice. They are grouped separately so the two states are never confused.
 */
export function MembersPanel({ membersHref }: { membersHref: string }) {
  const t = useTranslations("admin.members");
  const [members, setMembers] = useState<RichfieldAdminMember[]>([]);
  const [context, setContext] = useState<RichfieldAdminMembersContext | null>(
    null,
  );
  const [status, setStatus] = useState<"error" | "loading" | "ready">(
    "loading",
  );
  const [message, setMessage] = useState<string>(
    RICHFIELD_ADMIN_COPY.members.loading,
  );

  useEffect(() => {
    let active = true;

    const loadMembers = async () => {
      setStatus("loading");
      setMessage(RICHFIELD_ADMIN_COPY.members.loading);

      try {
        const response = await adminFetch("/api/admin/members", {
          cache: "no-store",
        });
        const payload = (await response
          .json()
          .catch(() => ({}))) as MembersResponse;

        if (!active) return;

        if (!response.ok || !payload.members) {
          setStatus("error");
          setMessage(payload.error ?? RICHFIELD_ADMIN_COPY.members.unavailable);
          return;
        }

        setMembers(payload.members);
        setContext(payload.context ?? null);
        setStatus("ready");
      } catch {
        if (!active) return;
        setStatus("error");
        setMessage(RICHFIELD_ADMIN_COPY.members.unavailable);
      }
    };

    void loadMembers();

    return () => {
      active = false;
    };
  }, []);

  const invited = members.filter((member) => member.status === "Invited");
  const active = members.filter((member) => member.status !== "Invited");

  return (
    <section className="grid min-w-0 gap-6">
      <Card className="border border-admin-rule bg-admin-panel py-0 shadow-none ring-0">
        <CardHeader className="gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-admin-clay/12 text-admin-clay">
              <UsersThree aria-hidden size={21} />
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate font-display text-2xl text-admin-ink">
                {context?.boundProjectName ?? t("team")}
              </CardTitle>
              <p className="mt-1 text-sm leading-6 text-admin-ink-soft">
                {t("description")}
              </p>
            </div>
          </div>
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 w-full rounded-lg bg-admin-navy text-white hover:bg-admin-navy/90 sm:w-auto",
          )}
          href={membersHref}
          rel="noreferrer"
          target="_blank"
        >
          <UserPlus aria-hidden data-icon="inline-start" size={17} />
          {t("manage")}
          <ArrowSquareOut aria-hidden data-icon="inline-end" size={15} />
        </Link>
        </CardHeader>
      </Card>

      {status === "loading" ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-label={t("loading")}>
          {[0, 1].map((item) => (
            <div
              className="h-28 animate-pulse rounded-xl border border-admin-rule bg-admin-panel"
              key={item}
            />
          ))}
        </div>
      ) : status === "error" ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {message}
        </div>
      ) : null}

      {status === "ready" && members.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-rule bg-admin-panel p-6 text-sm leading-6 text-admin-ink-soft">
          {t("empty")}
        </p>
      ) : null}

      <MemberGroup
        caption={RICHFIELD_ADMIN_COPY.members.activeCaption}
        members={active}
        title={RICHFIELD_ADMIN_COPY.members.activeTitle}
      />
      <MemberGroup
        caption={RICHFIELD_ADMIN_COPY.members.invitedCaption}
        members={invited}
        title={RICHFIELD_ADMIN_COPY.members.invitedTitle}
      />
    </section>
  );
}
