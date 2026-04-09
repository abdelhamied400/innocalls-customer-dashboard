import { PropsWithChildren, ReactNode } from "react";

type PostCallSurveyLayoutProps = PropsWithChildren<{
  createSheet: ReactNode;
}>;

const PostCallSurveyLayout = ({
  children,
  createSheet,
}: PostCallSurveyLayoutProps) => {
  return (
    <div className="post-call-survey-layout">
      {children}
      {createSheet}
    </div>
  );
};

export default PostCallSurveyLayout;
