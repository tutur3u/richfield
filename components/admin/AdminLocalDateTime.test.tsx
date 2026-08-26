import { describe, expect, it } from "vitest";
import { formatAdminLocalDateTime } from "./AdminLocalDateTime";

describe("formatAdminLocalDateTime", () => {
  it("includes the local hour, minute, and UTC offset", () => {
    expect(
      formatAdminLocalDateTime(
        "2026-08-26T09:03:00.000Z",
        "en-US",
        "Asia/Ho_Chi_Minh",
      ),
    ).toMatch(/Aug 26, 2026.*4:03 PM GMT\+7/);
  });

  it("returns null for an invalid timestamp", () => {
    expect(formatAdminLocalDateTime("not-a-date", "en-US")).toBeNull();
  });
});
