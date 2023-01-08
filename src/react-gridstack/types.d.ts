import { RefObject, Dispatch, SetStateAction, MutableRefObject } from "react";
import { GridStack, numberOrString } from "gridstack4";

interface GridstackStack {
  id: number;
  gridRef: RefObject<GridStack>;
  items: GridstackItem[];
}

interface GridstackItem {
  id: numberOrString;
  idRef: MutableRefObject<number | undefined>;
  ref: RefObject<HTMLDivElement>;
  properties: GridStackItemProperties;
  // TODO: maybe can be deleted!
  updateProperties: Dispatch<SetStateAction<GridStackItemProperties>>;
}

interface GridStackItemProperties {
  /** widget position x (default?: 0) */
  x?: number;
  /** widget position y (default?: 0) */
  y?: number;
  /** widget dimension width (default?: 1) */
  width?: number;
  /** widget dimension height (default?: 1) */
  height?: number;
  /** if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) */
  autoPosition?: boolean;
  /** minimum width allowed during resize/creation (default?: undefined = un-constrained) */
  minWidth?: number;
  /** maximum width allowed during resize/creation (default?: undefined = un-constrained) */
  maxWidth?: number;
  /** minimum height allowed during resize/creation (default?: undefined = un-constrained) */
  minHeight?: number;
  /** maximum height allowed during resize/creation (default?: undefined = un-constrained) */
  maxHeight?: number;
  /** if the item is resizeable (default: true) */
  isResizable?: boolean;
  /** if the item is moveable (default: true) */
  isMoveable?: boolean;
  /** Prevent movement by other items (default: false) */
  isLocked?: boolean;
  /** widgets can have their own custom resize handles. For example 'e,w' will make that particular widget only resize east and west. See `resizable: {handles: string}` option */
  resizeHandles?: string;
  /** value for `gs-id` stored on the widget (default?: undefined) */
  id?: numberOrString;
}
