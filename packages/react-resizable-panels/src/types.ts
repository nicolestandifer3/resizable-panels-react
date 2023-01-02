import { RefObject } from "react";

export type Direction = "horizontal" | "vertical";

export type PanelOnCollapse = (collapsed: boolean) => void;
export type PanelOnResize = (size: number) => void;

export type PanelData = {
  callbacksRef: RefObject<{
    onCollapse: PanelOnCollapse | null;
    onResize: PanelOnResize | null;
  }>;
  collapsible: boolean;
  defaultSize: number;
  id: string;
  maxSize: number;
  minSize: number;
  order: number | null;
};

export type ResizeEvent = KeyboardEvent | MouseEvent | TouchEvent;
export type ResizeHandler = (event: ResizeEvent) => void;
