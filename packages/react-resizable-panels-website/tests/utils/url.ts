import { Page } from "@playwright/test";
import { ReactElement } from "react";
import { PanelGroupProps } from "react-resizable-panels";
import { UrlPanelGroupToEncodedString } from "../../src/utils/UrlData";

export async function goToUrl(
  page: Page,
  element: ReactElement<PanelGroupProps>
) {
  const encodedString = UrlPanelGroupToEncodedString(element);

  const url = new URL("http://localhost:1234/__e2e");
  url.searchParams.set("urlPanelGroup", encodedString);

  await page.goto(url.toString());
}

export async function updateUrl(
  page: Page,
  element: ReactElement<PanelGroupProps>
) {
  const encodedString = UrlPanelGroupToEncodedString(element);

  await page.evaluate(
    ([encodedString]) => {
      const url = new URL(window.location.href);
      url.searchParams.set("urlPanelGroup", encodedString);

      window.history.pushState(
        { urlPanelGroup: encodedString },
        "",
        url.toString()
      );

      window.dispatchEvent(new Event("popstate"));
    },
    [encodedString]
  );
}
