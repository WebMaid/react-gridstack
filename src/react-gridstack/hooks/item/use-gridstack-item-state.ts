import { useState } from "react";
import { GridStackItemProperties } from "../../types";

export const useGridstackItemState = (
  initialValues: GridStackItemProperties
) => {
  const [itemState, setItemState] = useState<GridStackItemProperties>({
    ...initialValues,
  });

  const setPosition = ({ x, y }: { x: number; y: number }) => {
    setItemState((prev) => ({ ...prev, x, y }));
  };

  const setVerticalPosition = (y: number) => {
    setItemState((prev) => ({ ...prev, y }));
  };

  const setHorizontalPosition = (x: number) => {
    setItemState((prev) => ({ ...prev, x }));
  };

  const setSize = ({ width, height }: { width: number; height: number }) => {
    setItemState((prev) => ({ ...prev, width, height }));
  };

  const setHeight = (height: number) => {
    setItemState((prev) => ({ ...prev, height }));
  };

  const setWidth = (width: number) => {
    setItemState((prev) => ({ ...prev, width }));
  };

  const enableResize = () => {
    setItemState((prev) => ({ ...prev, isResizable: true }));
  };

  const disableResize = () => {
    setItemState((prev) => ({ ...prev, isResizable: false }));
  };

  const enableMove = () => {
    setItemState((prev) => ({ ...prev, isMoveable: true }));
  };

  const disableMove = () => {
    setItemState((prev) => ({ ...prev, isMoveable: false }));
  };

  const lock = () => {
    setItemState((prev) => ({ ...prev, isLocked: true }));
  };

  const unlock = () => {
    setItemState((prev) => ({ ...prev, isLocked: false }));
  };

  const setAutoPosition = (enabled: boolean) => {
    setItemState((prev) => ({ ...prev, autoPosition: enabled }));
  };

  return [
    itemState,
    {
      setState: setItemState,
      setPosition,
      setSize,
      setVerticalPosition,
      setHorizontalPosition,
      setWidth,
      setHeight,
      enableResize,
      disableResize,
      enableMove,
      disableMove,
      lock,
      unlock,
      setAutoPosition,
    },
  ] as const;
};
