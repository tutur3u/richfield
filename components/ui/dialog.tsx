"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Dialog(props: DialogPrimitive.Root.Props) { return <DialogPrimitive.Root data-slot="dialog" {...props} />; }
function DialogTrigger(props: DialogPrimitive.Trigger.Props) { return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />; }
function DialogPortal(props: DialogPrimitive.Portal.Props) { return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />; }
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) { return <DialogPrimitive.Backdrop className={cn("fixed inset-0 z-50 bg-black/35 backdrop-blur-xs duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className)} data-slot="dialog-overlay" {...props} />; }
function DialogContent({ className, ...props }: DialogPrimitive.Popup.Props) { return <DialogPortal><DialogOverlay /><DialogPrimitive.Popup className={cn("fixed left-1/2 top-1/2 z-50 grid max-h-[min(85vh,42rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-2xl border border-admin-rule bg-admin-panel p-5 text-admin-ink shadow-2xl outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:p-6", className)} data-slot="dialog-content" {...props} /></DialogPortal>; }
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("grid gap-1.5", className)} data-slot="dialog-header" {...props} />; }
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) { return <DialogPrimitive.Title className={cn("font-display text-2xl", className)} data-slot="dialog-title" {...props} />; }
function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) { return <DialogPrimitive.Description className={cn("text-sm leading-6 text-admin-ink-soft", className)} data-slot="dialog-description" {...props} />; }
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("-mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-admin-rule bg-admin-surface p-4 sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end", className)} data-slot="dialog-footer" {...props} />; }
function DialogClose({ variant = "outline", ...props }: DialogPrimitive.Close.Props & Pick<React.ComponentProps<typeof Button>, "variant">) { return <DialogPrimitive.Close render={<Button variant={variant} />} {...props} />; }

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger };
