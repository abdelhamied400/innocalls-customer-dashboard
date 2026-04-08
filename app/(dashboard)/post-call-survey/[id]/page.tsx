"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const PostCallSurveyDetailRedirect = () => {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/post-call-survey/${id}/details`);
  }, [id, router]);

  return null;
};

export default PostCallSurveyDetailRedirect;
