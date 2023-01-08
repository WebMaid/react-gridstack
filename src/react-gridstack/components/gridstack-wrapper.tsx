import { PropsWithChildren, RefObject } from "react";

interface GridstackWrapperProps {
  wrapperRef: RefObject<HTMLDivElement>;
}

export const GridstackWrapper = ({
  children,
  wrapperRef,
}: PropsWithChildren<GridstackWrapperProps>) => {
  return (
    <div className="grid-stack" ref={wrapperRef}>
      {children}
    </div>
  );
};
