const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-panel">
      <div className="login-copy">
        <h2>Sign in</h2>
        <p>Continue with Google to unlock your protected workspace.</p>
      </div>
      <button className="login-button" onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login;