import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Received token:", token);
      localStorage.setItem("token", token);
      navigate("/dashboard");
      console.log("Token stored in localStorage and navigating to dashboard...");
    } else {
      alert("Token not present.");
    }
      }, []);

  return (
    <div>
      <h1>Logging in....</h1>
    </div>
  );
};

export default Success;