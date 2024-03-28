import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../api/useApi";
import { User } from "../../hooks/useUser";
import useAuth from "../../hooks/useAuth";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // https://dmitripavlutin.com/react-useeffect-explanation/
  useEffect(() => {
    if (isAuthenticated() === true) {
      navigate("/profile");
    }
  }, [isAuthenticated]);

  const { isLoading, error, data, fetchData } = useApi<User>({
    url: "/user/login/",
    method: "post",
    data: {
      email,
      password,
    },
  });

  useEffect(() => {
    if (data) {
      login(data);
      navigate("/profile");
    }
  }, [data]);

  const onLoginFunc = () => {
    console.log("Logging in...");
    fetchData();
  };

  return (
    <div>
      <input
        placeholder="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {error && <div>{JSON.stringify(error.response?.data)}</div>}
      {data && <div>Logged in!</div>}
      {data && <div>{JSON.stringify(data)}</div>}

      <button onClick={onLoginFunc}>Login</button>
    </div>
  );
}
