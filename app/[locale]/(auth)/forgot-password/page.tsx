import ForgotPasswordForm from "./form";

const ForgotPassword = () => {
  return (
    <div
      className="page h-full flex justify-center items-center"
      id="forgot-password"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>Forgot Password!</h1>
        <p className="text-sm">Reset your password via E-mail!</p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
