import { test, expect, Page } from "@playwright/test";
import { createElement } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { verifyAriaValues } from "./utils/aria";
import { goToUrl } from "./utils/url";

async function goToDefaultUrl(
  page: Page,
  direction: "horizontal" | "vertical" = "horizontal"
) {
  await goToUrl(
    page,
    createElement(
      PanelGroup,
      { direction },
      createElement(Panel),
      createElement(PanelResizeHandle),
      createElement(Panel)
    )
  );
}

// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
test.describe("Window Splitter", () => {
  test.describe("initial ARIA value attributes", () => {
    test("scenario: own minSize", async ({ page }) => {
      await goToUrl(
        page,
        createElement(
          PanelGroup,
          { direction: "horizontal" },
          createElement(Panel, { defaultSize: 35, minSize: 20 }),
          createElement(PanelResizeHandle),
          createElement(Panel, { minSize: 5 })
        )
      );

      const resizeHandles = page.locator("[data-panel-resize-handle-id]");
      await verifyAriaValues(resizeHandles.first(), {
        min: 20,
        max: 95,
        now: 35,
      });
    });

    test("scenario: other minSize(s)", async ({ page }) => {
      await goToUrl(
        page,
        createElement(
          PanelGroup,
          { direction: "horizontal" },
          createElement(Panel, { minSize: 20 }),
          createElement(PanelResizeHandle),
          createElement(Panel, { minSize: 50 })
        )
      );

      const resizeHandles = page.locator("[data-panel-resize-handle-id]");
      await verifyAriaValues(resizeHandles.first(), {
        min: 20,
        max: 50,
        now: 50,
      });
    });

    test("scenario: own maxSize", async ({ page }) => {
      await goToUrl(
        page,
        createElement(
          PanelGroup,
          { direction: "horizontal" },
          createElement(Panel, { maxSize: 50 }),
          createElement(PanelResizeHandle),
          createElement(Panel)
        )
      );

      const resizeHandles = page.locator("[data-panel-resize-handle-id]");
      await verifyAriaValues(resizeHandles.first(), {
        min: 10,
        max: 50,
        now: 50,
      });
    });

    test("scenario: other maxSize(s)", async ({ page }) => {
      await goToUrl(
        page,
        createElement(
          PanelGroup,
          { direction: "horizontal" },
          createElement(Panel, { defaultSize: 65 }),
          createElement(PanelResizeHandle),
          createElement(Panel, { maxSize: 40 })
        )
      );

      const resizeHandles = page.locator("[data-panel-resize-handle-id]");
      await verifyAriaValues(resizeHandles.first(), {
        min: 60,
        max: 90,
        now: 65,
      });
    });
  });

  test.describe("arrow keys", () => {
    test("horizontal lists", async ({ page }) => {
      await goToDefaultUrl(page);

      const resizeHandle = page.locator("[data-panel-resize-handle-id]");
      await resizeHandle.focus();

      await verifyAriaValues(resizeHandle, {
        now: 50,
      });

      await page.keyboard.press("ArrowRight");
      await verifyAriaValues(resizeHandle, {
        now: 51,
      });

      await page.keyboard.press("ArrowRight");
      await verifyAriaValues(resizeHandle, {
        now: 52,
      });

      // This isn't officially part of the spec but it seems like a nice tweak
      await page.keyboard.press("Shift+ArrowRight");
      await verifyAriaValues(resizeHandle, {
        now: 62,
      });

      await page.keyboard.press("ArrowLeft");
      await verifyAriaValues(resizeHandle, {
        now: 61,
      });

      // This isn't officially part of the spec but it seems like a nice tweak
      await page.keyboard.press("Shift+ArrowLeft");
      await verifyAriaValues(resizeHandle, {
        now: 51,
      });

      // Up and down arrows should not affect a "horizontal" list
      await page.keyboard.press("ArrowUp");
      await verifyAriaValues(resizeHandle, {
        now: 51,
      });
      await page.keyboard.press("ArrowDown");
      await verifyAriaValues(resizeHandle, {
        now: 51,
      });
    });

    test("vertical lists", async ({ page }) => {
      await goToDefaultUrl(page, "vertical");

      const resizeHandle = page.locator("[data-panel-resize-handle-id]");
      await resizeHandle.focus();

      await verifyAriaValues(resizeHandle, {
        now: 50,
      });

      // Up and down arrows should affect a "vertical" list
      await page.keyboard.press("ArrowUp");
      await verifyAriaValues(resizeHandle, {
        now: 49,
      });

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await verifyAriaValues(resizeHandle, {
        now: 51,
      });

      await page.keyboard.press("Shift+ArrowDown");
      await verifyAriaValues(resizeHandle, {
        now: 61,
      });
      await page.keyboard.press("Shift+ArrowUp");
      await page.keyboard.press("Shift+ArrowUp");
      await verifyAriaValues(resizeHandle, {
        now: 41,
      });

      // But Left and right arrows should be ignored
      await page.keyboard.press("ArrowLeft");
      await verifyAriaValues(resizeHandle, {
        now: 41,
      });
      await page.keyboard.press("ArrowRight");
      await verifyAriaValues(resizeHandle, {
        now: 41,
      });
    });
  });

  test.describe("other keys", () => {
    test("Enter key", async ({ page }) => {
      await goToDefaultUrl(page);

      const resizeHandle = page.locator("[data-panel-resize-handle-id]");
      await resizeHandle.focus();
      await verifyAriaValues(resizeHandle, {
        min: 10,
        max: 90,
        now: 50,
      });

      await page.keyboard.press("Enter");
      await verifyAriaValues(resizeHandle, {
        now: 10,
      });

      await page.keyboard.press("Enter");
      await verifyAriaValues(resizeHandle, {
        now: 90,
      });

      await page.keyboard.press("Enter");
      await verifyAriaValues(resizeHandle, {
        now: 10,
      });
    });

    test("Home and End keys", async ({ page }) => {
      await goToUrl(
        page,
        createElement(
          PanelGroup,
          { direction: "horizontal" },
          createElement(Panel, { defaultSize: 40, maxSize: 70, minSize: 20 }),
          createElement(PanelResizeHandle),
          createElement(Panel)
        )
      );

      const resizeHandle = page.locator("[data-panel-resize-handle-id]");
      await resizeHandle.focus();

      await verifyAriaValues(resizeHandle, {
        now: 40,
      });

      // Verify Home/End keys respect maxSize/minSize props

      await page.keyboard.press("End");
      await verifyAriaValues(resizeHandle, {
        now: 70,
      });

      await page.keyboard.press("Home");
      await verifyAriaValues(resizeHandle, {
        now: 20,
      });
    });

    test("implements optional F6 key functionality", async ({ page }) => {
      await goToUrl(
        page,
        createElement(
          PanelGroup,
          { direction: "horizontal" },
          createElement(Panel),
          createElement(PanelResizeHandle),
          createElement(Panel),
          createElement(PanelResizeHandle),
          createElement(Panel),
          createElement(PanelResizeHandle),
          createElement(Panel)
        )
      );

      const resizeHandles = page.locator("[data-panel-resize-handle-id]");
      const first = resizeHandles.nth(0);
      const second = resizeHandles.nth(1);
      const third = resizeHandles.nth(2);

      await first.focus();
      await expect(first).toBeFocused();

      await page.keyboard.press("F6");
      await expect(second).toBeFocused();

      await page.keyboard.press("F6");
      await expect(third).toBeFocused();

      await page.keyboard.press("F6");
      await expect(first).toBeFocused();

      // Should be focused on the next (first) resize handle
      await page.keyboard.press("Shift+F6");
      await expect(third).toBeFocused();

      await page.keyboard.press("Shift+F6");
      await expect(second).toBeFocused();

      await page.keyboard.press("Shift+F6");
      await expect(first).toBeFocused();
    });
  });
});
