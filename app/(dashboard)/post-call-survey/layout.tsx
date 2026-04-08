import { PropsWithChildren } from "react";

type PostCallSurveyLayoutProps = PropsWithChildren<{}>;

const PostCallSurveyLayout = ({ children }: PostCallSurveyLayoutProps) => {
  return <div className="post-call-survey-layout">{children}</div>;
};

export default PostCallSurveyLayout;
