import { Box } from "@chakra-ui/react";
import { type ReactElement, useMemo, useEffect } from "react";
import { style, FlexCol, FlexRow, type FCc, undefined, type FC, useQueryParam } from "./react";

const TabWrapper = style(FlexCol, {});
export const TabBar = style(FlexRow, {
  flexWrap: `wrap`,
  justifyContent: `stretch`,
  backgroundColor: `#EEF`,
  gap: `3px`,
  paddingBottom: `0.5rem`,
  marginBottom: `0.25rem`,
  position: `sticky`,
  top: 0,
  zIndex: 100,
});
const TabContent = style(FlexCol, { justifyContent: `stretch` });
const _Tab: FCc<{ selected: boolean; onClick: () => void; }> = ({ children, selected, onClick, ...props }) => <Box
  style={{ borderColor: selected ? `blue` : undefined }}
  onClick={onClick}
  {...props}
>{children}</Box>;
const Tab = style(_Tab, { alignItems: `center`, borderBottom: `2px solid #999`, padding: `0.2rem 0.5rem 0` });

export type Tab = {
  name: string;
  component: ReactElement;
  id?: string;
  isHidden?: boolean;
};

export const Tabs: FC<{
  tabs: Tab[];
  queryParam?: string;
}> = (props) => {
  const [curTab, setCurTab] = useQueryParam(props.queryParam ?? `tab`);

  const tabIds = useMemo(() => props.tabs.map(t => t.id ?? t.name), [props.tabs]);
  useEffect(() => {
    if (!tabIds.includes(curTab!))
      setCurTab(tabIds[0]);
  }, [curTab, setCurTab, tabIds]);
  return <TabWrapper>
    <TabBar className={props.className}>
      {props.tabs.filter(t => !t.isHidden).map(t => <Tab key={t.id ?? t.name}
        selected={(t.id ?? t.name) === curTab}
        onClick={() => setCurTab(t.id ?? t.name)}
      >{t.name}</Tab>)}
    </TabBar>
    {props.tabs.filter(t => !t.isHidden).map(t => <TabContent key={t.id ?? t.name}
      style={{ display: (t.id ?? t.name) === curTab ? undefined : `none` }}
    >
      {t.component}
    </TabContent>)}
  </TabWrapper>;
};
