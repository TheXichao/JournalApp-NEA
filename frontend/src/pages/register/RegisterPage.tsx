import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApi from "../../api/useApi";
import { User } from "../../hooks/useUser";

interface registerRequestData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export default function RegisterPage(): JSX.Element {
  // my states
  const [registerRequestData, setregisterRequestData] =
    useState<registerRequestData>({} as registerRequestData);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { isLoading, error, data, fetchData } = useApi<User>({
    url: "/user/register/",
    method: "post",
    data: {
      email: registerRequestData.email,
      password: registerRequestData.password,
      first_name: registerRequestData.first_name,
      last_name: registerRequestData.last_name,
    },
  });

  useEffect(() => {
    if (data) {
      // redirect to profile page
      login(data);
      navigate("/profile");
    }
  }, [data]);
  const onRegisterFunc = () => {
    console.log("Registering...");
    fetchData(); // triggers myApiCall
  };
  return (
    <div>
      <input
        placeholder="email"
        value={registerRequestData.email}
        onChange={(e) =>
          setregisterRequestData({
            ...registerRequestData,
            email: e.target.value,
          })
        }
      />
      <input
        type="password"
        placeholder="password"
        value={registerRequestData.password}
        onChange={(e) =>
          setregisterRequestData({
            ...registerRequestData,
            password: e.target.value,
          })
        }
      />
      <input
        placeholder="first name"
        value={registerRequestData.first_name}
        onChange={(e) =>
          setregisterRequestData({
            ...registerRequestData,
            first_name: e.target.value,
          })
        }
      />
      <input
        placeholder="last name"
        value={registerRequestData.last_name}
        onChange={(e) =>
          setregisterRequestData({
            ...registerRequestData,
            last_name: e.target.value,
          })
        }
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {error && <div>{JSON.stringify(error.response?.data)}</div>}
      {data && (
        <div>
          Registered successfully
          <div>Welcome {data.first_name}</div>
        </div>
      )}

      <br />

      <input
        disabled={isLoading}
        type="button"
        value="Register"
        onClick={onRegisterFunc}
      />
    </div>
  );
}
