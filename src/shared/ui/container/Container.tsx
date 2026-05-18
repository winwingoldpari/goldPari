import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const Container = ({children, className}: ContainerProps) => {
  return (
    <div className={`max-w-[1790px] px-3.5 xl:px-20 mx-auto w-full ${className ?? ""}`}>
      {children}
    </div>
  );
};
