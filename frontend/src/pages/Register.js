import AuthForm from "../components/AuthForm";

const Register = ({ setIsLoggedIn, onSuccess }) => {
  return (
    <AuthForm
      mode="register"
      setIsLoggedIn={setIsLoggedIn}
      onSuccess={onSuccess}
    />
  );
};

export default Register;
