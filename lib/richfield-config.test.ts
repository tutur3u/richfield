import { describe, expect, test } from "vitest";
import {
  buildRichfieldCentralizedLoginUrl,
  buildRichfieldCmsUrl,
  buildRichfieldDriveUrl,
  buildRichfieldWorkspaceUrl,
  sanitizeRichfieldNextPath,
} from "./richfield-config";

describe("Richfield config links", () => {
  test("opens CMS workspace targets through the configured CMS app", () => {
    expect(
      buildRichfieldCmsUrl({
        cmsBaseUrl: "https://cms.tuturuuu.localhost",
        targetKey: "preview",
        workspaceId: "ws-richfield",
      }),
    ).toBe("https://cms.tuturuuu.localhost/ws-richfield/preview");
  });

  test("opens member management through the main Tuturuuu app", () => {
    expect(
      buildRichfieldWorkspaceUrl({
        targetKey: "members",
        webAppUrl: "https://tuturuuu.localhost",
        workspaceId: "ws-richfield",
      }),
    ).toBe("https://tuturuuu.localhost/ws-richfield/members");
  });

  test("opens Tuturuuu Drive through the main Tuturuuu app", () => {
    expect(
      buildRichfieldDriveUrl({
        webAppUrl: "https://tuturuuu.localhost",
        workspaceId: "ws-richfield",
      }),
    ).toBe("https://tuturuuu.localhost/ws-richfield/drive");
  });

  test("sanitizes admin return paths to the Richfield origin", () => {
    expect(
      sanitizeRichfieldNextPath(
        "/admin?target=storage",
        "https://richfield.localhost",
      ),
    ).toBe("/admin?target=storage");
    expect(
      sanitizeRichfieldNextPath(
        "https://richfield.localhost/admin?target=members",
        "https://richfield.localhost",
      ),
    ).toBe("/admin?target=members");
    expect(
      sanitizeRichfieldNextPath(
        "https://evil.example/admin",
        "https://richfield.localhost",
      ),
    ).toBe("/admin");
    expect(sanitizeRichfieldNextPath("//evil.example/admin")).toBe("/admin");
  });

  test("scopes centralized login return URLs to the Richfield app origin", () => {
    const loginUrl = new URL(
      buildRichfieldCentralizedLoginUrl({
        appBaseUrl: "https://richfield.localhost",
        nextUrl: "https://evil.example/admin",
        webAppUrl: "https://tuturuuu.localhost",
      }),
    );

    expect(loginUrl.origin).toBe("https://tuturuuu.localhost");
    expect(loginUrl.pathname).toBe("/login");

    const returnUrl = new URL(loginUrl.searchParams.get("returnUrl") ?? "");
    expect(returnUrl.origin).toBe("https://richfield.localhost");
    expect(returnUrl.pathname).toBe("/verify-token");
    expect(returnUrl.searchParams.get("nextUrl")).toBe("/admin");
  });
});
