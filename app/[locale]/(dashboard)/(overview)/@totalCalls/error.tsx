"use client";

const Error = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const tryAgain = () => {
    reset();
  };
  return (
    <div className="error">
      <p>Error</p>
      <button onClick={tryAgain}>try again</button>
    </div>
  );
};

export default Error;
