import { PropsWithChildren } from "react";

type WebCallLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
  editSheet: React.ReactNode;
}>;

const WebCallLayout = ({ children, createSheet, editSheet }: WebCallLayoutProps) => {
  return (
    <>
      {children}
      {createSheet}
      {editSheet}
    </>
  );
};

export default WebCallLayout;
