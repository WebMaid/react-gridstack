import { useEffect, useRef } from "react";
import { useGridstackContext } from "../../context/gridstack-context";
import { getGridstackItemProps } from "../../helpers";
import { useGridstackStore } from "../../store";
import { GridStackItemProperties } from "../../types";
import { useGridstackItemState } from "./use-gridstack-item-state";

interface UseGridstackItemProps {
  /** This values are only used to initialize the item */
  defaultValues?: GridStackItemProperties;
  /** This values are used as the current value (we are watching it) */
  values?: GridStackItemProperties;
}

export const useGridstackItem = ({
  defaultValues,
  values,
}: UseGridstackItemProps = {}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<number>();
  const registerItem = useGridstackStore((x) => x.registerItem);
  const unregisterItem = useGridstackStore((x) => x.unregisterItem);
  const { gridstackId, gridRef } = useGridstackContext();
  const currentItem = useGridstackStore((x) => x.stacks)
    .find((x) => x.id === gridstackId?.current)
    ?.items.find((x) => x.idRef.current === idRef.current);
  const initialValues = {
    ...(defaultValues ?? {}),
    ...(values ?? {}),
  };

  const [itemState, actions] = useGridstackItemState(initialValues);

  useEffect(() => {
    actions.setState((prev) => ({
      ...prev,
      ...values,
    }));
  }, Object.values(values ?? {}));

  useEffect(() => {
    if (!itemRef.current) return;
    gridRef?.current?.removeWidget(itemRef.current, false);
    const properties = getGridstackItemProps(itemState, idRef.current);
    Object.entries(properties).forEach(([key, value]) => {
      itemRef.current?.setAttribute(key, value);
    });
    gridRef?.current?.makeWidget(itemRef.current);
  }, [itemState, idRef.current]);

  useEffect(() => {
    if (!gridstackId?.current) return;
    registerItem(
      gridstackId.current,
      itemRef,
      itemState,
      actions.setState,
      idRef
    );

    () => {
      if (!gridstackId.current || !idRef.current) return;
      unregisterItem(gridstackId.current, idRef.current);
      idRef.current = undefined;
    };
  }, [itemRef, gridstackId?.current]);

  return {
    wrapperProps: {
      className: "grid-stack-item",
      ref: itemRef,
      ...getGridstackItemProps(itemState, idRef.current),
    },
    contentProps: {
      className: "grid-stack-item-content",
    },
    actions,
  };
};
