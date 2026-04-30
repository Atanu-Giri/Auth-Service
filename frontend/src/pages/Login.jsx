const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-page">
      {/* ── Left Hero Panel ── */}
      <div className="login-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Secure Authentication
          </div>

          <h1 className="hero-title">
            Your identity,{" "}
            <span className="gradient-text">verified & protected.</span>
          </h1>

          <p className="hero-description">
            A seamless authentication experience powered by Google OAuth 2.0.
            Sign in once and access your protected workspace instantly.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">🔒</span>
              OAuth 2.0
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">⚡</span>
              JWT Tokens
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">🛡️</span>
              Session-less
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">🌐</span>
              Google SSO
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Login Panel ── */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            {/* Shield icon */}
            <div className="login-card-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h2 className="login-card-title">Welcome back</h2>
            <p className="login-card-subtitle">
              Sign in to continue to your protected workspace.
            </p>
          </div>

          <button
            id="google-login-btn"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            {/* Google "G" Logo */}
            <svg className="google-btn-icon" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="login-divider">
            <span>secured by</span>
          </div>

          <div className="login-security">
            <span className="login-security-icon">🔐</span>
            <p>
              Your data is encrypted and protected. We only access your basic
              profile information from Google.
            </p>
          </div>

          <div className="login-footer">
            <p>
              By continuing, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;