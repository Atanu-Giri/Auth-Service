import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/protected/dashboard", {
            withCredentials: true,
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;