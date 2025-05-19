import LoginForm from "./form";

const Login = () => {
  return (
    <div className="page h-full flex justify-center items-center" id="login">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>Sign in to Innocalls platform!</h1>
        <p className="text-sm">
          Elevate Your Business with Seamless Cloud Communication Solutions
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
