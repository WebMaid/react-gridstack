import { Stack } from "@mantine/core";
import { Component, ReactNode, useEffect, useState } from "react";
import { AddHandler, Category, Item, ItemContent } from "./category";
import { useGridstackStore } from "./react-gridstack/store";
import * as portals from "react-reverse-portal";

export type ItemState = {
  id: string;
  label: string;
  items: {
    id: string;
    x: number;
    y: number;
  }[];
};

let itemContentPortals: { id: string; portal: portals.HtmlPortalNode }[] = [];

export type ItemContentPortal = typeof itemContentPortals[number];

const addPortalIfNotPresent = (id: string) => {
  if (itemContentPortals.some((x) => x.id === id)) return;
  const portal = portals.createHtmlPortalNode({
    attributes: {
      class: "grid-stack-item-content",
    },
  });
  itemContentPortals.push({ id, portal });
};

const removePortal = (id: string) => {
  const index = itemContentPortals.findIndex((x) => x.id === id);
  if (index === -1) return;
  itemContentPortals.splice(index, 1);
};

export const App = () => {
  const [items, setItems] = useState<ItemState[]>(
    categories.map((c) => ({
      ...c,
      items: c.items.map((i) => ({
        ...i,
        portal: portals.createHtmlPortalNode(),
      })),
    }))
  );
  const [ports, setPortals] = useState<typeof itemContentPortals>([]);
  const stacks = useGridstackStore((x) => x.stacks);

  useEffect(() => {
    items
      .flatMap((x) => x.items)
      .forEach((x) => {
        addPortalIfNotPresent(x.id);
      });
    const notPresent = itemContentPortals.filter(
      (x) => !items.flatMap((x) => x.items).some((y) => y.id === x.id)
    );
    notPresent.forEach((x) => {
      removePortal(x.id);
    });
    setPortals(itemContentPortals);
  }, [items]);

  const onAdd: AddHandler = (prevId, currId, item) => {
    if (prevId === currId) return;
    const previous = stacks.find((x) => x.id === prevId);
    const prevCategoryId = previous?.gridRef.current?.opts.id;
    const current = stacks.find((x) => x.id === currId);
    const currCategoryId = current?.gridRef.current?.opts.id;
    const currentItem = previous?.items.find((i) => i.id === item.id);
    if (!currentItem) return;

    if (currentItem.ref.current) {
      current?.gridRef.current?.removeWidget(currentItem.ref.current, false);
    }

    setItems((prev) => {
      const categoryItem = prev
        .flatMap((c) => c.items)
        .find((i) => i.id === currentItem!.properties.id);

      if (!categoryItem) return prev;

      return prev.map((category) => {
        if (category.id !== prevCategoryId && category.id !== currCategoryId)
          return category;

        if (category.id === prevCategoryId) {
          return {
            ...category,
            items: category.items.filter((i) => i.id !== categoryItem.id),
          };
        }

        return {
          ...category,
          items: category.items.concat({
            ...categoryItem,
            x: item.x,
            y: item.y,
          }),
        };
      });
    });
  };

  return (
    <Stack>
      {ports.map((item) => (
        <portals.InPortal key={item.id} node={item.portal}>
          <ItemContent index={0} />
        </portals.InPortal>
      ))}
      {items.map((c) => (
        <Category key={c.id} {...c} onAdd={onAdd} ports={ports} />
      ))}
    </Stack>
  );
};

const categories = [
  {
    id: "1",
    label: "Kategorie 1",
    items: [
      { id: "1", x: 0, y: 0 },
      { id: "2", x: 1, y: 0 },
      { id: "3", x: 2, y: 0 },
      { id: "4", x: 3, y: 0 },
      { id: "5", x: 4, y: 0 },
    ],
  },
  {
    id: "2",
    label: "Kategorie 2",
    items: [
      { id: "6", x: 0, y: 0 },
      { id: "7", x: 1, y: 0 },
      { id: "8", x: 2, y: 0 },
      { id: "9", x: 3, y: 0 },
      { id: "10", x: 4, y: 0 },
    ],
  },
  {
    id: "3",
    label: "Kategorie 3",
    items: [
      { id: "11", x: 0, y: 0 },
      { id: "12", x: 1, y: 0 },
      { id: "13", x: 2, y: 0 },
      { id: "14", x: 3, y: 0 },
      { id: "15", x: 4, y: 0 },
    ],
  },
];

export type CategoryType = typeof categories[number];
