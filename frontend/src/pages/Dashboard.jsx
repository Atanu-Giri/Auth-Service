import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  console.log("Dashboard rendered");

  useEffect(() => {
    console.log("useEffect STARTED"); // 🔥 must print

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/protected/dashboard",
          { withCredentials: true }
        );

        console.log("API RESPONSE:", res.data); // 🔥 must print
        setData(res.data);
      } catch (err) {
        console.log("API ERROR:", err);
        navigate("/");
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    axios.post(
      "http://localhost:5000/auth/logout",
      {},
      { withCredentials: true }
    )
    .then(() => {
      navigate("/");
    })
    .catch((err) => {
      console.log("Logout error:", err);
    });
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;