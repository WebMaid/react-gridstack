import { GridStack, numberOrString } from "gridstack4";
import { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import create from "zustand";
import { getGridstackItemProps } from "./helpers";
import { GridStackItemProperties, GridstackStack } from "./types";

export const useGridstackStore = create<GridstackStoreType>((set, get) => ({
  registerItem: (stackId, item, props, setProps, idRef) => {
    set((prev) => ({
      ...prev,
      nextItemId: prev.nextItemId + 1,
      stacks: addItemToStack(
        prev.stacks,
        stackId,
        item,
        prev.nextItemId,
        props,
        setProps,
        idRef
      ),
    }));
  },
  nextItemId: 1,
  unregisterItem: (stackId, itemId) => {
    set((prev) => ({
      ...prev,
      stacks: prev.stacks.map((s) =>
        s.id !== stackId
          ? s
          : {
              ...s,
              items: s.items.filter((i) => i.id !== itemId),
            }
      ),
    }));
  },
  updateItemProperties: (stackId, itemId) => {
    set((prev) => ({
      ...prev,
      stacks: prev.stacks.map((s) =>
        s.id !== stackId
          ? s
          : {
              ...s,
              items: s.items.map((i) => {
                if (i.id !== itemId) return i;

                Object.entries(getGridstackItemProps(i.properties)).forEach(
                  ([key, value]) => {
                    i.ref.current?.setAttribute(key, value);
                  }
                );

                return i;
              }),
            }
      ),
    }));
  },
  registerStack: (gridRef) => {
    set((prev) => ({
      ...prev,
      nextStackId: prev.nextStackId + 1,
      stacks: [...prev.stacks, { gridRef, items: [], id: prev.nextStackId }],
    }));
    return get().stacks.find(
      (x) => x.gridRef.current?.opts.id === gridRef.current?.opts.id
    )!.id;
  },
  nextStackId: 1,
  unregisterStack: (gridstackId) => {
    set((prev) => ({
      ...prev,
      stacks: prev.stacks.filter(
        (s) => s.gridRef.current?.opts.id !== gridstackId
      ),
    }));
  },
  stacks: [],
}));

type GridstackStoreType = {
  registerItem: (
    stackId: number,
    item: RefObject<HTMLDivElement>,
    props: GridStackItemProperties,
    setProps: Dispatch<SetStateAction<GridStackItemProperties>>,
    idRef: MutableRefObject<number | undefined>
  ) => void;
  unregisterItem: (stackId: number, itemId: number) => void;
  nextItemId: number;
  updateItemProperties: (stackId: number, itemId: number) => void;
  registerStack: (gridRef: RefObject<GridStack>) => number;
  nextStackId: number;
  unregisterStack: (gridstackId: numberOrString) => void;
  stacks: GridstackStack[];
};

const addItemToStack = (
  stacks: GridstackStoreType["stacks"],
  stackId: number,
  itemRef: RefObject<HTMLDivElement>,
  itemId: number,
  props: GridStackItemProperties,
  setProps: Dispatch<SetStateAction<GridStackItemProperties>>,
  idRef: MutableRefObject<number | undefined>
): GridstackStoreType["stacks"] => {
  const others = stacks.filter((x) => x.id !== stackId);
  const current = stacks.find((x) => x.id === stackId);
  if (!current) return others;

  idRef.current = itemId;

  current?.items.push({
    id: itemId,
    ref: itemRef,
    properties: props,
    updateProperties: setProps,
    idRef,
  });
  return [...others, current];
};

export const useCurrentGridstackItems = (
  gridstackId: numberOrString | undefined
) => {
  const stacks = useGridstackStore((x) => x.stacks);
  const currentStack = stacks.find(
    (x) => x.gridRef.current?.opts.id === gridstackId
  );
  if (!currentStack) return [];

  return currentStack.items;
};
