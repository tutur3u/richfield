"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";
import type { RichfieldStorageAnalyticsState } from "@/lib/richfield-admin-storage";
import type { RichfieldStorageFilesState } from "@/lib/richfield-storage-files";
import { RichfieldGalleryPanel } from "./RichfieldGalleryPanel";
import {
} from "./AdminFormFields";
import { ContentForm } from "./AdminContentForm";
import {
  ContentCardCover,
  contentItemMetaLabel,
  sectionCopy,
  statusClass,
  statusLabel,
  type Draft,
} from "./AdminContentHelpers";
import { getInitials, MembersPanel } from "./AdminMembersPanel";
import {
  ResponseForwardingPanel,
  StoragePanel,
} from "./AdminStoragePanel";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";
import {
  adminFetch,
  scheduleRichfieldAdminSessionRefresh,
} from "./richfield-admin-session-client";
import {
  type MutationResponse,
} from "./richfield-admin-save-progress";
import {
  getRichfieldEditorCloseIntent,
} from "./richfield-admin-editor-state";

type AdminTab = RichfieldAdminCollectionKey | "account" | "members" | "storage";

type DashboardContent = Record<
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem[]
>;


type EditorTarget = {
  collectionKey: RichfieldAdminCollectionKey;
  initialDraft?: Partial<Draft>;
  itemId: string | null;
};

const contentTabs: RichfieldAdminCollectionKey[] = [
  "articles",
  "jobs",
  "brands",
  "leadership",
  "milestones",
  "contact-page",
  "contact-form",
  "contact-channels",
  "image-library",
  "contact-submissions",
];

// Grouped rather than flat: the thirteen surfaces divide cleanly into what you
// publish, what the public sends back, the asset stores, and workspace admin.
// Order within each group follows how often an editor reaches for it.
const tabGroups: Array<{
  label: string;
  tabs: Array<{ id: AdminTab; label: string }>;
}> = [
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.content,
    tabs: [
      { id: "articles", label: RICHFIELD_ADMIN_COPY.tabs.articles },
      { id: "jobs", label: RICHFIELD_ADMIN_COPY.tabs.jobs },
      { id: "brands", label: RICHFIELD_ADMIN_COPY.tabs.brands },
      { id: "leadership", label: RICHFIELD_ADMIN_COPY.tabs.leadership },
      { id: "milestones", label: RICHFIELD_ADMIN_COPY.tabs.milestones },
    ],
  },
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.contact,
    tabs: [
      {
        id: "contact-submissions",
        label: RICHFIELD_ADMIN_COPY.tabs.contactSubmissions,
      },
      { id: "contact-page", label: RICHFIELD_ADMIN_COPY.tabs.contactPage },
      { id: "contact-form", label: RICHFIELD_ADMIN_COPY.tabs.contactForm },
      {
        id: "contact-channels",
        label: RICHFIELD_ADMIN_COPY.tabs.contactChannels,
      },
    ],
  },
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.media,
    tabs: [
      { id: "image-library", label: RICHFIELD_ADMIN_COPY.tabs.gallery },
      { id: "storage", label: RICHFIELD_ADMIN_COPY.tabs.storage },
    ],
  },
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.team,
    tabs: [
      { id: "members", label: RICHFIELD_ADMIN_COPY.tabs.members },
      { id: "account", label: RICHFIELD_ADMIN_COPY.tabs.account },
    ],
  },
];

function ContentList({
  collectionKey,
  items,
  onNew,
  onSelect,
  selectedId,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  items: RichfieldAdminContentItem[];
  onNew: () => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const copy = sectionCopy[collectionKey];

  return (
    <section className="grid min-w-0 content-start gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="script-label">{copy.listTitle}</p>
          <h2 className="font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
            Manage {copy.listTitle.toLowerCase()}
          </h2>
        </div>
        <button
          className={`min-h-11 w-full border px-4 text-sm font-bold transition sm:w-auto ${
            selectedId === null
              ? "border-[var(--gold)] bg-[var(--navy)] text-[var(--parchment)]"
              : "border-[rgba(184,112,81,0.48)] bg-white/72 text-[var(--copper-dark)] hover:border-[var(--gold)]"
          }`}
          onClick={onNew}
          type="button"
        >
          {copy.newLabel}
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <button
              className={`grid min-w-0 gap-4 border bg-white/72 p-4 text-left transition ${
                selectedId === item.id
                  ? "border-[var(--gold)] shadow-[0_18px_46px_rgba(82,40,37,0.12)]"
                  : "border-[rgba(184,112,81,0.38)] hover:border-[var(--copper)]"
              }`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
                <ContentCardCover item={item} />
                <div className="grid min-w-0 content-start gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${statusClass(
                        item.status,
                      )}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                    {item.imageUrl ? (
                      <span className="border border-[rgba(31,107,115,0.22)] bg-[rgba(31,107,115,0.08)] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--teal)]">
                        Image ready
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <strong className="block break-words text-base text-[var(--ink)]">
                      {item.title}
                    </strong>
                    <span className="mt-1 block break-words text-sm text-[var(--ink-soft)]">
                      {contentItemMetaLabel(collectionKey, item)}
                    </span>
                  </div>
                  {item.summary ? (
                    <span className="line-clamp-2 text-xs leading-5 text-[var(--ink-soft)]">
                      {item.summary}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[rgba(184,112,81,0.5)] bg-white/68 p-6">
          <h3 className="font-display text-3xl leading-none text-[var(--navy)]">
            Nothing here yet.
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
            {copy.empty}
          </p>
        </div>
      )}
    </section>
  );
}


export function RichfieldAdminDashboard({
  driveHref,
  // Which surface to open on. Supplied by the route when the dashboard is
  // mounted inside the section shell, so the URL — not internal state — decides
  // what you are looking at.
  initialTab = "image-library",
  initialContent,
  membersHref,
  sessionExpiresAt,
  sessionRefreshEarlySeconds,
  // The shell already provides navigation and the account actions; rendering
  // the dashboard's own tab row and header underneath would duplicate both.
  showChrome = true,
  storageAnalytics,
  storageFiles,
  userEmail,
}: {
  driveHref: string;
  initialTab?: AdminTab;
  initialContent: DashboardContent;
  membersHref: string;
  sessionExpiresAt: string;
  sessionRefreshEarlySeconds?: number;
  showChrome?: boolean;
  storageAnalytics: RichfieldStorageAnalyticsState;
  storageFiles: RichfieldStorageFilesState;
  userEmail: string | null;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [content, setContent] = useState(initialContent);
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [editorBusy, setEditorBusy] = useState(false);
  const [editorDirty, setEditorDirty] = useState(false);
  const [confirmEditorClose, setConfirmEditorClose] = useState(false);
  const [selectedIds, setSelectedIds] = useState<
    Record<RichfieldAdminCollectionKey, string | null>
  >({
    articles: initialContent.articles[0]?.id ?? null,
    brands: initialContent.brands[0]?.id ?? null,
    "contact-channels": initialContent["contact-channels"][0]?.id ?? null,
    "contact-page": initialContent["contact-page"][0]?.id ?? null,
    "contact-form": initialContent["contact-form"][0]?.id ?? null,
    "contact-submissions": initialContent["contact-submissions"][0]?.id ?? null,
    "image-library": initialContent["image-library"][0]?.id ?? null,
    jobs: initialContent.jobs[0]?.id ?? null,
    leadership: initialContent.leadership[0]?.id ?? null,
    milestones: initialContent.milestones[0]?.id ?? null,
  });

  useEffect(
    () =>
      scheduleRichfieldAdminSessionRefresh({
        expiresAt: sessionExpiresAt,
        refreshEarlySeconds: sessionRefreshEarlySeconds,
      }),
    [sessionExpiresAt, sessionRefreshEarlySeconds],
  );

  useEffect(() => {
    if (!editorTarget) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [editorTarget]);

  const refreshContent = async (
    collectionKeys: RichfieldAdminCollectionKey[] = contentTabs,
  ) => {
    const nextContent = { ...content };

    await Promise.all(
      collectionKeys.map(async (collectionKey) => {
        const response = await adminFetch(`/api/admin/content/${collectionKey}`, {
          cache: "no-store",
        });
        const payload = (await response
          .json()
          .catch(() => ({}))) as MutationResponse;

        if (response.ok && payload.items) {
          nextContent[collectionKey] = payload.items;
        }
      }),
    );

    setContent(nextContent);
    setSelectedIds((current) => {
      const next = { ...current };

      for (const collectionKey of collectionKeys) {
        const selectedId = next[collectionKey];
        if (
          !selectedId ||
          !nextContent[collectionKey].some((item) => item.id === selectedId)
        ) {
          next[collectionKey] = nextContent[collectionKey][0]?.id ?? null;
        }
      }

      return next;
    });
  };

  const openEditor = (target: EditorTarget) => {
    setConfirmEditorClose(false);
    setEditorBusy(false);
    setEditorDirty(false);
    setEditorTarget(target);
  };

  const closeEditor = () => {
    setConfirmEditorClose(false);
    setEditorBusy(false);
    setEditorDirty(false);
    setEditorTarget(null);
  };

  const requestCloseEditor = () => {
    const intent = getRichfieldEditorCloseIntent({
      isBusy: editorBusy,
      isDirty: editorDirty,
    });

    if (intent === "close") {
      closeEditor();
      return;
    }

    if (intent === "warn") {
      setConfirmEditorClose(true);
    }
  };

  const renderContentTab = (collectionKey: RichfieldAdminCollectionKey) => {
    const items = content[collectionKey];
    const selectedId = selectedIds[collectionKey];

    if (collectionKey === "contact-submissions") {
      return (
        <section className="grid min-w-0 gap-6">
          <ResponseForwardingPanel items={items} />
          <ContentList
            collectionKey={collectionKey}
            items={items}
            onNew={() => {
              setSelectedIds((current) => ({ ...current, [collectionKey]: null }));
              openEditor({ collectionKey, itemId: null });
            }}
            onSelect={(id) => {
              setSelectedIds((current) => ({ ...current, [collectionKey]: id }));
              openEditor({ collectionKey, itemId: id });
            }}
            selectedId={selectedId}
          />
        </section>
      );
    }

    if (collectionKey === "image-library") {
      return (
        <section className="grid min-w-0 gap-6">
          <RichfieldGalleryPanel
            items={items}
            onSelect={(id) => {
              setSelectedIds((current) => ({
                ...current,
                [collectionKey]: id,
              }));
              openEditor({ collectionKey, itemId: id });
            }}
            selectedId={selectedId}
          />
        </section>
      );
    }

    return (
      <section className="grid min-w-0 gap-6">
        <ContentList
          collectionKey={collectionKey}
          items={items}
          onNew={() => {
            setSelectedIds((current) => ({
              ...current,
              [collectionKey]: null,
            }));
            openEditor({ collectionKey, itemId: null });
          }}
          onSelect={(id) => {
            setSelectedIds((current) => ({
              ...current,
              [collectionKey]: id,
            }));
            openEditor({ collectionKey, itemId: id });
          }}
          selectedId={selectedId}
        />
      </section>
    );
  };

  const editorItems = editorTarget
    ? content[editorTarget.collectionKey]
    : [];
  const editorItem =
    editorTarget?.itemId && editorItems.length > 0
      ? (editorItems.find((item) => item.id === editorTarget.itemId) ?? null)
      : null;

  // Inside the section shell the page band, min-height and max width are
  // already owned by the shell; repeating them here stacked a second
  // full-height surface inside the first and reintroduced the old page look.
  const Frame = showChrome ? "main" : "div";

  return (
    <Frame
      className={
        showChrome
          ? "section-band min-h-screen px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
          : ""
      }
    >
      <div
        className={
          showChrome
            ? "mx-auto grid min-w-0 max-w-7xl gap-6"
            : "grid min-w-0 gap-6"
        }
      >
        {showChrome ? (
        <header className="parchment-card overflow-hidden p-5 sm:p-6">
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <p className="script-label">
                {RICHFIELD_ADMIN_COPY.dashboard.eyebrow}
              </p>
              <h1 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-6xl">
                {RICHFIELD_ADMIN_COPY.dashboard.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
                {RICHFIELD_ADMIN_COPY.dashboard.subtitle}
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link className="button-secondary w-full sm:w-auto" href="/">
                {RICHFIELD_ADMIN_COPY.account.viewSite}
              </Link>
              <form action="/api/auth/logout" className="min-w-0" method="post">
                <button className="button-primary w-full sm:w-auto" type="submit">
                  {RICHFIELD_ADMIN_COPY.account.signOut}
                </button>
              </form>
            </div>
          </div>
        </header>
        ) : null}

        {showChrome ? (
        <nav
          aria-label="Dashboard areas"
          className="flex flex-col gap-4 border-b border-[rgba(184,112,81,0.34)] pb-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4"
        >
          {tabGroups.map((group) => (
            <div className="min-w-0" key={group.label}>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--ink-soft)]/70">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {group.tabs.map((tab) => (
                  <button
                    aria-current={activeTab === tab.id ? "page" : undefined}
                    className={`min-h-11 border px-3 text-sm font-black transition sm:min-h-10 sm:px-4 ${
                      activeTab === tab.id
                        ? "border-[var(--clay)] bg-[rgba(164,78,67,0.08)] text-[var(--clay)]"
                        : "border-[rgba(184,112,81,0.28)] bg-white/35 text-[var(--ink-soft)] hover:border-[rgba(184,112,81,0.55)] hover:text-[var(--navy)]"
                    }`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        ) : null}

        {contentTabs.includes(activeTab as RichfieldAdminCollectionKey)
          ? renderContentTab(activeTab as RichfieldAdminCollectionKey)
          : null}

        {editorTarget ? (
          <div
            className="fixed inset-0 z-50 grid overscroll-contain bg-[rgba(12,31,52,0.72)] px-3 py-4 backdrop-blur-sm sm:px-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                requestCloseEditor();
              }
            }}
            role="presentation"
          >
            <section
              aria-label={`${editorTarget.itemId ? "Edit" : "Create"} ${sectionCopy[editorTarget.collectionKey].singular}`}
              aria-modal="true"
              className={`mx-auto grid max-h-[calc(100vh-2rem)] w-full min-w-0 overscroll-contain border border-[rgba(184,112,81,0.42)] bg-[var(--parchment)] self-center overflow-y-auto p-4 shadow-[0_28px_90px_rgba(12,31,52,0.44)] sm:p-5 ${
                editorTarget.collectionKey === "image-library"
                  ? "max-w-xl"
                  : "max-w-5xl"
              }`}
              role="dialog"
            >
              <ContentForm
                collectionKey={editorTarget.collectionKey}
                initialDraft={editorTarget.initialDraft}
                item={editorItem}
                key={`${editorTarget.collectionKey}-${editorTarget.itemId ?? "new"}-${editorTarget.initialDraft?.pageSection ?? ""}-${editorTarget.initialDraft?.placement ?? ""}`}
                onBusyChange={setEditorBusy}
                onClose={closeEditor}
                onCloseRequest={requestCloseEditor}
                onDeleted={(items) => {
                  setContent((current) => ({
                    ...current,
                    [editorTarget.collectionKey]: items,
                  }));
                  setSelectedIds((current) => ({
                    ...current,
                    [editorTarget.collectionKey]: items[0]?.id ?? null,
                  }));
                }}
                onDirtyChange={setEditorDirty}
                onSaved={(items, savedItem) => {
                  setContent((current) => ({
                    ...current,
                    [editorTarget.collectionKey]: items,
                  }));
                  setSelectedIds((current) => ({
                    ...current,
                    [editorTarget.collectionKey]:
                      savedItem?.id ?? items[0]?.id ?? null,
                  }));
                }}
              />
            </section>
            {confirmEditorClose ? (
              <div
                className="absolute inset-0 z-10 grid place-items-center bg-[rgba(12,31,52,0.36)] px-4"
                role="presentation"
              >
                <section
                  aria-label={RICHFIELD_ADMIN_COPY.editor.unsavedTitle}
                  aria-modal="true"
                  className="w-full max-w-md border border-[rgba(184,112,81,0.42)] bg-[var(--parchment)] p-5 shadow-[0_24px_80px_rgba(12,31,52,0.42)]"
                  role="alertdialog"
                >
                  <p className="script-label">
                    {RICHFIELD_ADMIN_COPY.editor.unsavedTitle}
                  </p>
                  <h3 className="mt-2 font-display text-4xl leading-none text-[var(--navy)]">
                    {RICHFIELD_ADMIN_COPY.editor.unsavedHeading}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                    {RICHFIELD_ADMIN_COPY.editor.unsavedDescription}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      className="button-secondary w-full"
                      onClick={() => setConfirmEditorClose(false)}
                      type="button"
                    >
                      {RICHFIELD_ADMIN_COPY.editor.keepEditing}
                    </button>
                    <button
                      className="button-primary w-full"
                      onClick={closeEditor}
                      type="button"
                    >
                      {RICHFIELD_ADMIN_COPY.editor.discardChanges}
                    </button>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        ) : null}


        {activeTab === "storage" ? (
          <StoragePanel
            driveHref={driveHref}
            onResourcesChanged={() => refreshContent(["image-library"])}
            storageAnalytics={storageAnalytics}
            storageFiles={storageFiles}
          />
        ) : null}

        {activeTab === "members" ? (
          <MembersPanel membersHref={membersHref} />
        ) : null}

        {activeTab === "account" ? (
          <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="parchment-card min-w-0 p-5 sm:p-6">
              <p className="script-label">
                {RICHFIELD_ADMIN_COPY.account.signedIn}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="grid size-14 place-items-center bg-[var(--navy)] font-display text-2xl text-[var(--parchment)]">
                  {getInitials(userEmail)}
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-[var(--ink)]">
                    {userEmail ?? "Website editor"}
                  </strong>
                  <span className="mt-1 block text-sm text-[var(--ink-soft)]">
                    {RICHFIELD_ADMIN_COPY.account.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="parchment-card grid min-w-0 content-start gap-3 p-5 sm:p-6">
              <Link className="button-primary w-full" href="/">
                {RICHFIELD_ADMIN_COPY.account.viewSite}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="button-secondary w-full" type="submit">
                  {RICHFIELD_ADMIN_COPY.account.signOut}
                </button>
              </form>
            </div>
          </section>
        ) : null}
      </div>
    </Frame>
  );
}
