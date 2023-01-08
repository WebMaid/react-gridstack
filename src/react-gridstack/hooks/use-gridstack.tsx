import { GridStack } from "gridstack4";
import { GridStackNode, GridStackOptions } from "gridstack/dist/types";
import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { RGS_ID } from "../constants";
import { readCurrentOrFallbackValue } from "../helpers";
import { useCurrentGridstackItems, useGridstackStore } from "../store";
import { GridstackItem } from "../types";
import { AddHandler } from "../../category";

interface UseGridstackProps {
  wrapperRef: RefObject<HTMLDivElement>;
  options: GridStackOptions;
  eventHandlers: {
    onAdd: AddHandler;
    onChange: () => void;
  };
}

export const useGridstack = ({
  wrapperRef,
  options,
  eventHandlers,
}: UseGridstackProps) => {
  const gridRef = useRef<GridStack>();
  const idRef = useRef<number>();
  const items = useCurrentGridstackItems(gridRef.current?.opts.id);
  const registerStack = useGridstackStore((x) => x.registerStack);
  const unregisterStack = useGridstackStore((x) => x.unregisterStack);
  const { handleChange, handleAddition } = useGridstackEventListeners(
    items,
    idRef.current,
    eventHandlers
  );

  useEffect(() => {
    if (!wrapperRef.current || gridRef.current) return;
    gridRef.current = GridStack.init(
      {
        ...options,
      },
      wrapperRef.current
    );
    console.log("register");
    idRef.current = registerStack(gridRef as RefObject<GridStack>);

    return () => {
      const id = gridRef.current?.opts.id;
      if (id) unregisterStack(id);
      console.log("unregister");
      gridRef.current?.destroy(false);
      gridRef.current = undefined;
      idRef.current = undefined;
    };
  }, [wrapperRef.current]);

  useEffect(() => {
    if (!gridRef.current) return;

    gridRef.current.on("change", handleChange);
    gridRef.current.on("added", handleAddition);
    return () => {
      if (!gridRef.current) return;
      gridRef.current.off("change");
      gridRef.current.off("added");
    };
  }, [items, handleChange, handleAddition]);

  useEffect(() => {
    if (!gridRef.current) return;
    updateWidgets(gridRef, items);
  }, [gridRef.current]);

  useEffect(() => {
    if (!gridRef.current) return;
    updateWidgets(gridRef, items);
  }, [items]);

  return { gridRef, idRef };
};

const updateWidgets = (
  gridRef: RefObject<GridStack | undefined>,
  items: GridstackItem[]
) => {
  const grid = gridRef.current;
  if (!grid) return;

  grid.batchUpdate();
  grid.removeAll(false);
  items.forEach((item) => {
    item.ref.current && grid.makeWidget(item.ref.current);
  });
  grid.batchUpdate(false);
};

const useGridstackEventListeners = (
  items: GridstackItem[],
  currentStackId: number | undefined,
  eventHandlers: {
    onAdd: AddHandler;
    onChange: () => void;
  }
) => {
  const stacks = useGridstackStore((x) => x.stacks);
  const stackItems = useMemo(
    () =>
      stacks
        .map((s) => ({
          ...s,
          items: s.items.map((i) => ({
            ...i,
            stackId: s.id,
          })),
        }))
        .flatMap((s) => s.items),
    [stacks]
  );

  const handleChange = useCallback(
    (_: Event, nodes: GridStackNode[]) => {
      const firstNode = nodes.at(0);
      if (!firstNode) return;

      const element = firstNode.el;
      const itemId = firstNode.el?.getAttribute(RGS_ID);
      if (!itemId || !element) return;

      const updateProperties = items.find(
        (i) => i.id === parseInt(itemId)
      )?.updateProperties;
      if (!updateProperties) return;

      updateProperties((prev) => ({
        ...prev,
        x: readCurrentOrFallbackValue(element, "x", prev.x),
        y: readCurrentOrFallbackValue(element, "y", prev.y),
        width: readCurrentOrFallbackValue(element, "width", prev.width),
        height: readCurrentOrFallbackValue(element, "height", prev.height),
      }));
      eventHandlers.onChange();
    },
    [items, eventHandlers.onChange]
  );

  const handleAddition = useCallback(
    (_: Event, nodes: GridStackNode[]) => {
      const firstNode = nodes.at(0);
      if (!firstNode || !currentStackId) return;

      const element = firstNode.el;
      const itemId = firstNode.el?.getAttribute(RGS_ID);
      if (!itemId || !element) return;

      const stackItem = stackItems.find((x) => x.id === parseInt(itemId));
      if (!stackItem) return;

      if (stackItem.stackId === currentStackId) return;

      stackItem.updateProperties((prev) => ({
        ...prev,
        x: firstNode.x,
        y: firstNode.y,
      }));

      eventHandlers.onAdd(stackItem.stackId, currentStackId, {
        x: firstNode.x!,
        y: firstNode.y!,
        id: parseInt(itemId),
      });
    },
    [stackItems, items, currentStackId, eventHandlers.onAdd]
  );

  return {
    handleChange,
    handleAddition,
  };
};
