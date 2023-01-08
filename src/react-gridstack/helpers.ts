import { GridItemHTMLElement } from "gridstack4";
import { GRIDSTACK_ITEM_PROPERTY, RGS_ID } from "./constants";
import { GridStackItemProperties } from "./types";

export const getGridstackItemProps = (
  itemProps: GridStackItemProperties,
  itemId?: number
) => {
  const gridstackItemProps: Record<string, string> = {};
  Object.keys(GRIDSTACK_ITEM_PROPERTY).forEach((p) => {
    const value = itemProps[p as keyof GridStackItemProperties];
    if (value === undefined || value === null) return;
    gridstackItemProps[
      GRIDSTACK_ITEM_PROPERTY[p as keyof GridStackItemProperties]
    ] = value.toString();
  });

  if (itemId) gridstackItemProps[RGS_ID] = itemId.toString();
  return gridstackItemProps;
};

export const readCurrentOrFallbackValue = (
  element: GridItemHTMLElement,
  property: keyof GridStackItemProperties,
  fallback: number | undefined
) => {
  const current = element.getAttribute(GRIDSTACK_ITEM_PROPERTY[property]);
  if (!current) return fallback;
  const converted = parseInt(current);
  if (isNaN(converted)) return fallback;
  return converted;
};
