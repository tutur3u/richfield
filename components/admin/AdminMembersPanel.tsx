"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  RichfieldAdminMember,
  RichfieldAdminMembersContext,
} from "@/lib/richfield-admin-members";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";
import { adminFetch } from "./richfield-admin-session-client";

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
    <div className="grid min-w-0 gap-3 border border-line bg-paper p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`grid size-11 shrink-0 place-items-center font-display text-xl ${
            invited
              ? "border border-line border-dashed text-muted"
              : "bg-ink text-paper"
          }`}
        >
          {member.initials}
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-ink">{member.name}</strong>
          {member.email ? (
            <span className="mt-0.5 block truncate text-sm text-muted">
              {member.email}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span
          className={`px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${
            invited
              ? "border border-gold/40 bg-gold/10 text-gold-strong"
              : "border border-line bg-cream text-muted"
          }`}
        >
          {member.status}
        </span>
        <span className="border border-line bg-cream px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted">
          {member.role}
        </span>
      </div>
    </div>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="script-label">{RICHFIELD_ADMIN_COPY.members.title}</p>
          <h2 className="break-words font-display text-4xl leading-none text-ink sm:text-5xl">
            {context?.boundProjectName ?? "Site team"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {RICHFIELD_ADMIN_COPY.members.description}
          </p>
        </div>
        <Link
          className="button-primary w-full sm:w-auto"
          href={membersHref}
          rel="noreferrer"
          target="_blank"
        >
          {RICHFIELD_ADMIN_COPY.members.manage}
        </Link>
      </div>

      {status === "loading" || status === "error" ? (
        <div className="border border-line bg-paper px-4 py-3 text-sm text-muted">
          {message}
        </div>
      ) : null}

      {status === "ready" && members.length === 0 ? (
        <p className="border border-line border-dashed bg-paper p-6 text-sm leading-6 text-muted">
          {RICHFIELD_ADMIN_COPY.members.empty}
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
