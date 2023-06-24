import useIsomorphicLayoutEffect from "./hooks/useIsomorphicEffect";
import useUniqueId from "./hooks/useUniqueId";
import {
  createElement,
  CSSProperties,
  ElementType,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "./vendor/react";

import { PanelGroupContext } from "./PanelContexts";
import {
  PanelCallbackRef,
  PanelData,
  PanelOnCollapse,
  PanelOnResize,
} from "./types";

export type PanelProps = {
  children?: ReactNode;
  className?: string;
  collapsedSize?: number;
  collapsible?: boolean;
  defaultSize?: number | null;
  id?: string | null;
  maxSize?: number;
  minSize?: number;
  onCollapse?: PanelOnCollapse | null;
  onResize?: PanelOnResize | null;
  order?: number | null;
  style?: CSSProperties;
  tagName?: ElementType;
};

export type ImperativePanelHandle = {
  collapse: () => void;
  expand: () => void;
  getCollapsed(): boolean;
  getSize(): number;
  resize: (percentage: number) => void;
};

function PanelWithForwardedRef({
  children = null,
  className: classNameFromProps = "",
  collapsedSize = 0,
  collapsible = false,
  defaultSize = null,
  forwardedRef,
  id: idFromProps = null,
  maxSize = 100,
  minSize = 10,
  onCollapse = null,
  onResize = null,
  order = null,
  style: styleFromProps = {},
  tagName: Type = "div",
}: PanelProps & {
  forwardedRef: ForwardedRef<ImperativePanelHandle>;
}) {
  const context = useContext(PanelGroupContext);
  if (context === null) {
    throw Error(
      `Panel components must be rendered within a PanelGroup container`
    );
  }

  const panelId = useUniqueId(idFromProps);

  const {
    collapsePanel,
    expandPanel,
    getPanelStyle,
    registerPanel,
    resizePanel,
    unregisterPanel,
  } = context;

  // Use a ref to guard against users passing inline props
  const callbacksRef = useRef<{
    onCollapse: PanelOnCollapse | null;
    onResize: PanelOnResize | null;
  }>({ onCollapse, onResize });
  useEffect(() => {
    callbacksRef.current.onCollapse = onCollapse;
    callbacksRef.current.onResize = onResize;
  });

  // Basic props validation
  if (minSize < 0 || minSize > 100) {
    throw Error(`Panel minSize must be between 0 and 100, but was ${minSize}`);
  } else if (maxSize < 0 || maxSize > 100) {
    throw Error(`Panel maxSize must be between 0 and 100, but was ${maxSize}`);
  } else {
    if (defaultSize !== null) {
      if (defaultSize < 0 || defaultSize > 100) {
        throw Error(
          `Panel defaultSize must be between 0 and 100, but was ${defaultSize}`
        );
      } else if (minSize > defaultSize && !collapsible) {
        console.error(
          `Panel minSize ${minSize} cannot be greater than defaultSize ${defaultSize}`
        );

        defaultSize = minSize;
      }
    }
  }

  const style = getPanelStyle(panelId, defaultSize);

  const committedValuesRef = useRef<{
    size: number;
  }>({
    size: parseSizeFromStyle(style),
  });
  const panelDataRef = useRef<{
    callbacksRef: PanelCallbackRef;
    collapsedSize: number;
    collapsible: boolean;
    defaultSize: number | null;
    id: string;
    maxSize: number;
    minSize: number;
    order: number | null;
  }>({
    callbacksRef,
    collapsedSize,
    collapsible,
    defaultSize,
    id: panelId,
    maxSize,
    minSize,
    order,
  });
  useIsomorphicLayoutEffect(() => {
    committedValuesRef.current.size = parseSizeFromStyle(style);

    panelDataRef.current.callbacksRef = callbacksRef;
    panelDataRef.current.collapsedSize = collapsedSize;
    panelDataRef.current.collapsible = collapsible;
    panelDataRef.current.defaultSize = defaultSize;
    panelDataRef.current.id = panelId;
    panelDataRef.current.maxSize = maxSize;
    panelDataRef.current.minSize = minSize;
    panelDataRef.current.order = order;
  });

  useIsomorphicLayoutEffect(() => {
    registerPanel(panelId, panelDataRef as PanelData);

    return () => {
      unregisterPanel(panelId);
    };
  }, [order, panelId, registerPanel, unregisterPanel]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      collapse: () => collapsePanel(panelId),
      expand: () => expandPanel(panelId),
      getCollapsed() {
        return committedValuesRef.current.size === 0;
      },
      getSize() {
        return committedValuesRef.current.size;
      },
      resize: (percentage: number) => resizePanel(panelId, percentage),
    }),
    [collapsePanel, expandPanel, panelId, resizePanel]
  );

  return createElement(Type, {
    children,
    className: classNameFromProps,
    "data-panel": "",
    "data-panel-collapsible": collapsible || undefined,
    "data-panel-id": panelId,
    "data-panel-size": parseFloat("" + style.flexGrow).toFixed(1),
    id: `data-panel-id-${panelId}`,
    style: {
      ...style,
      ...styleFromProps,
    },
  });
}

export const Panel = forwardRef<ImperativePanelHandle, PanelProps>(
  (props: PanelProps, ref: ForwardedRef<ImperativePanelHandle>) =>
    createElement(PanelWithForwardedRef, { ...props, forwardedRef: ref })
);

// Workaround for Parcel scope hoisting (which renames objects/functions).
// Casting to :any is required to avoid corrupting the generated TypeScript types.
// See github.com/parcel-bundler/parcel/issues/8724
(PanelWithForwardedRef as any).displayName = "Panel";
(Panel as any).displayName = "forwardRef(Panel)";

// HACK
function parseSizeFromStyle(style: CSSProperties): number {
  const { flexGrow } = style;
  if (typeof flexGrow === "string") {
    return parseFloat(flexGrow);
  } else {
    return flexGrow as number;
  }
}
