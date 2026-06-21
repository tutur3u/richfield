import { describe, expect, test } from "vitest";
import {
  buildRichfieldCmsUrl,
  buildRichfieldDriveUrl,
  buildRichfieldWorkspaceUrl,
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
});
