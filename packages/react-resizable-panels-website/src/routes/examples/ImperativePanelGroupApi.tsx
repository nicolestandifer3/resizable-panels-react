import { RefObject, useRef, useState } from "react";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
} from "react-resizable-panels";

import ResizeHandle from "../../components/ResizeHandle";

import Example from "./Example";
import styles from "./ImperativePanelGroupApi.module.css";
import sharedStyles from "./shared.module.css";
import Code from "../../components/Code";
import { ImperativePanelGroupHandle } from "react-resizable-panels";

type Sizes = {
  left: number;
  middle: number;
  right: number;
};

export default function ImperativePanelGroupApiRoute() {
  return (
    <Example
      code={CODE}
      exampleNode={<Content />}
      headerNode={
        <>
          <p>
            <code>PanelGroup</code> provides the following imperative API
            methods:
          </p>
          <ul>
            <li>
              <Code
                className={sharedStyles.InlineCode}
                code="getLayout(): number[]"
                language="typescript"
              />
              Current size of panels
            </li>
            <li>
              <Code
                className={sharedStyles.InlineCode}
                code="setLayout(panelSizes: number[]): void"
                language="typescript"
              />
              Resize all panels
            </li>
          </ul>
        </>
      }
      language="tsx"
      title="Imperative PanelGroup API"
    />
  );
}

function Content() {
  const [sizes, setSizes] = useState<number[]>([]);

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const onLayout = (sizes: number[]) => {
    setSizes(sizes);
  };

  const resetLayout = () => {
    const panelGroup = panelGroupRef.current;
    if (panelGroup) {
      panelGroup.setLayout([50, 50]);
    }
  };

  return (
    <>
      <div className={styles.TopRow}>
        <button className={sharedStyles.Button} onClick={resetLayout}>
          Reset layout
        </button>
      </div>
      <div className={sharedStyles.PanelGroupWrapper}>
        <PanelGroup
          className={sharedStyles.PanelGroup}
          direction="horizontal"
          id="imperative-PanelGroup-api"
          onLayout={onLayout}
          ref={panelGroupRef}
        >
          <Panel className={sharedStyles.PanelRow}>
            <div className={sharedStyles.Centered}>
              left: {Math.round(sizes[0])}
            </div>
          </Panel>
          <ResizeHandle className={sharedStyles.ResizeHandle} />
          <Panel className={sharedStyles.PanelRow}>
            <div className={sharedStyles.Centered}>
              right: {Math.round(sizes[1])}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
}

const CODE = `
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

const ref = useRef<ImperativePanelGroupHandle>(null);

const resetLayout = () => {
  const panelGroup = ref.current;
  if (panelGroup) {
    // Reset each Panel to 50% of the group's width
    panelGroup.setLayout([50, 50]);
  }
};

<PanelGroup direction="horizontal" ref={ref}>
  <Panel>left</Panel>
  <PanelResizeHandle />
  <Panel>right</Panel>
</PanelGroup>
`;
