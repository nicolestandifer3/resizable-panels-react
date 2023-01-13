import { expect, Page, test } from "@playwright/test";
import { createElement } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { PanelGroupLayoutLogEntry } from "../src/routes/examples/types";

import { clearLogEntries, getLogEntries } from "./utils/debug";
import { goToUrl } from "./utils/url";

async function openPage(page: Page) {
  const panelGroup = createElement(
    PanelGroup,
    { direction: "horizontal", id: "group" },
    createElement(Panel, { collapsible: true, defaultSize: 20, order: 1 }),
    createElement(PanelResizeHandle, { id: "left-handle" }),
    createElement(Panel, { defaultSize: 60, order: 2 }),
    createElement(PanelResizeHandle, { id: "right-handle" }),
    createElement(Panel, { collapsible: true, defaultSize: 20, order: 3 })
  );

  await goToUrl(page, panelGroup);
}

async function verifyEntries(page: Page, expectedSizes: number[][]) {
  const logEntries = await getLogEntries<PanelGroupLayoutLogEntry>(
    page,
    "onLayout"
  );

  expect(logEntries.length).toEqual(expectedSizes.length);

  for (let index = 0; index < expectedSizes.length; index++) {
    const actual = logEntries[index].sizes;
    const expected = expectedSizes[index];
    expect(actual).toEqual(expected);
  }
}

test.describe("PanelGroup onLayout prop", () => {
  test.beforeEach(async ({ page }) => {
    await openPage(page);
  });

  test("should be called once on-mount", async ({ page }) => {
    await verifyEntries(page, [[20, 60, 20]]);
  });

  test("should be called when the panel group is resized", async ({ page }) => {
    const leftHandle = page.locator(
      '[data-panel-resize-handle-id="left-handle"]'
    );
    const rightHandle = page.locator(
      '[data-panel-resize-handle-id="right-handle"]'
    );

    await clearLogEntries(page, "onLayout");

    await leftHandle.focus();
    await page.keyboard.press("Home");
    await rightHandle.focus();
    await page.keyboard.press("End");
    await page.keyboard.press("Shift+ArrowLeft");

    await verifyEntries(page, [
      [0, 80, 20],
      [0, 100, 0],
      [0, 90, 10],
    ]);
  });
});
