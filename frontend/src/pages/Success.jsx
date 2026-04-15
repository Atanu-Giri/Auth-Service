import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } else if (!localStorage.getItem("token")) {
      alert("Token not present.");
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>Logging in....</h1>
    </div>
  );
};

export default Success;