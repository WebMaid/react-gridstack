import { GridStack } from "gridstack4";
import { createContext, PropsWithChildren, RefObject, useContext } from "react";

type GridstackContextType = {
  gridstackId: RefObject<number | undefined> | null;
  gridRef: RefObject<GridStack | undefined> | null;
};

const GridstackContext = createContext<GridstackContextType>({
  gridstackId: null,
  gridRef: null,
});

type GridstackContextProviderProps = GridstackContextType;

export const GridstackContextProvider = ({
  gridstackId,
  gridRef,
  children,
}: PropsWithChildren<GridstackContextProviderProps>) => {
  return (
    <GridstackContext.Provider value={{ gridstackId, gridRef }}>
      {children}
    </GridstackContext.Provider>
  );
};

export const useGridstackContext = () => useContext(GridstackContext);
