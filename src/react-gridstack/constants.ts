import { GridStackItemProperties } from "./types";

export const GRIDSTACK_ITEM_PROPERTY: Record<
  keyof GridStackItemProperties,
  `gs-${string}`
> = {
  x: "gs-x",
  y: "gs-y",
  width: "gs-w",
  height: "gs-h",
  minWidth: "gs-min-w",
  minHeight: "gs-min-h",
  maxWidth: "gs-max-w",
  maxHeight: "gs-max-h",
  autoPosition: "gs-auto-position",
  id: "gs-id",
  isResizable: "gs-no-resize",
  isLocked: "gs-locked",
  isMoveable: "gs-no-move",
  resizeHandles: "gs-resize-handles",
} as const;

export const RGS_ID = "rgs-id";
