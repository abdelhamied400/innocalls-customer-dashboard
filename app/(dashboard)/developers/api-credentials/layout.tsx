import { PropsWithChildren } from "react";

type ApiCredentialsLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
  editSheet: React.ReactNode;
}>;

const ApiCredentialsLayout = ({ children, createSheet, editSheet }: ApiCredentialsLayoutProps) => {
  return (
    <>
      {children}
      {createSheet}
      {editSheet}
    </>
  );
};

export default ApiCredentialsLayout;
