import AuthForm from "../components/AuthForm";

const Login = ({ setIsLoggedIn, onSuccess }) => {
  return (
    <AuthForm
      mode="login"
      setIsLoggedIn={setIsLoggedIn}
      onSuccess={onSuccess}
    />
  );
};

export default Login;
