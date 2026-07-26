import { RichfieldAdminSkeleton } from "./RichfieldAdminSkeleton";

/**
 * Dashboard loading state.
 *
 * Previously a `<progress value={50}>` that never moved: it claimed the work
 * was half done on every render — a number the page had no way to know — above
 * a list of steps that were not really being ticked off. A skeleton of the
 * actual dashboard says the same thing honestly, and lands the real content in
 * the same places instead of jumping.
 */
export function RichfieldAdminLoadingPanel() {
  return <RichfieldAdminSkeleton />;
}
