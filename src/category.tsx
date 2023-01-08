import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import { IconDots } from "@tabler/icons";
import { ReactNode, useRef, useState } from "react";
import { CategoryType, ItemContentPortal, ItemState } from "./App";
import { GridstackWrapper } from "./react-gridstack/components/gridstack-wrapper";
import { GridstackContextProvider } from "./react-gridstack/context/gridstack-context";
import { useGridstackItem } from "./react-gridstack/hooks/item/use-gridstack-item";
import { useGridstack } from "./react-gridstack/hooks/use-gridstack";
import * as portals from "react-reverse-portal";

export type AddHandler = (
  previousId: number,
  currentId: number,
  item: {
    id: number;
    x: number;
    y: number;
  }
) => void;

export const Category = ({
  id,
  label,
  items,
  onAdd,
  ports,
}: ItemState & {
  onAdd: AddHandler;
  ports: ItemContentPortal[];
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { gridRef, idRef } = useGridstack({
    wrapperRef,
    options: {
      column: 12,
      cellHeight: 140,
      staticGrid: false,
      margin: 16,
      float: true,
      id,
      acceptWidgets: true,
    },
    eventHandlers: {
      onAdd,
      onChange: () => {},
    },
  });

  return (
    <GridstackContextProvider gridstackId={idRef} gridRef={gridRef}>
      <Card withBorder>
        <Stack>
          <Group position="apart">
            <Title order={4}>Name of category</Title>
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={16} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
            </Menu>
          </Group>
          <GridstackWrapper wrapperRef={wrapperRef}>
            {items.map((item, i) => (
              <Item
                key={item.id}
                {...item}
                portal={ports.find((x) => x.id === item.id)?.portal}
              />
            ))}
          </GridstackWrapper>
        </Stack>
      </Card>
    </GridstackContextProvider>
  );
};

export const Item = ({
  x,
  y,
  id,
  portal,
}: {
  x: number;
  y: number;
  id: string;
  portal: portals.HtmlPortalNode | undefined;
}) => {
  const gridstackItem = useGridstackItem({
    defaultValues: {
      y: y,
      x: x,
      id: id,
    },
  });

  return (
    <div {...gridstackItem.wrapperProps}>
      {!portal ? null : <portals.OutPortal node={portal} />}
    </div>
  );
};

const useItemContent = () => {
  return {
    props: {
      className: "grid-stack-item-content",
    },
  };
};

export const ItemContent = ({ index }: { index: number }) => {
  const [state, setState] = useState(0);
  const { props } = useItemContent();

  return (
    <Card {...props} withBorder>
      <span>Item {index}</span>
      <Button fullWidth onClick={() => setState((x) => x + 1)}>
        {state}
      </Button>
    </Card>
  );
};
