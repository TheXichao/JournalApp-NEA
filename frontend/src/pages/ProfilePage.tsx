import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../hooks/useUser";
import useUser from "../hooks/useUser";
// import useApi from "../api/useApi";

// interface requestFeedback {
//   message: string;
// }

export default function ProfilePage() {
  const navigate = useNavigate();
  const { getUser } = useUser();
  // const [isChecked, setIsChecked] = useState<boolean | null>(null);
  const [myUser, setMyUser] = useState<User | null>(null);
  // const { isLoading, error, data, fetchData } = useApi<requestFeedback>({
  //   url: "/user/update_email_prompt/",
  //   method: "POST",
  //   data: {
  //     email_prompt: isChecked,
  //   },
  //   headers: {
  //     Authorization: `Token ${myUser?.authToken}`,
  //   },
  // });

  // function updateEmailJournal() {
  //   console.log("Updating email journal");
  //   const myToken = myUser?.authToken;
  //   fetchData(); // This will trigger the API call
  // }

  useEffect(() => {
    const user = getUser();
    if (user) {
      setMyUser(user);
    } else {
      navigate("/login");
    }
  }, []);

  if (!myUser) {
    return <div>user not found</div>;
  } else {
    return (
      <div>
        <h1>Profile</h1>
        <div>
          <div>
            <div>
              <label htmlFor="id:">User ID:</label>
              <input
                type="text"
                id="id"
                name="id"
                value={myUser.user_id}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={myUser.email}
                readOnly
              />
            </div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={myUser.first_name + " " + myUser.last_name}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="name">Auth token:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={myUser.authToken}
              readOnly
            />

            <div>
              <button onClick={() => navigate("/statistics")}>
                View Statistics
              </button>
            </div>

            {/* <div className="entries"></div>
            <div className="emailJournal">
              <label htmlFor="emailJournal">
                Would you like daily Journal Email feature:
              </label>
              <div className="emailJournalCheckbox">
                <input
                  type="checkbox"
                  id="emailJournal"
                  name="emailJournal"
                  checked={myUser.email_prompt}
                  onChange={(event) => {
                    setIsChecked(event.target.checked);
                  }}
                />
                {isChecked ? "yes" : "no"}
                <input
                  disabled={isLoading}
                  type="button"
                  value="save"
                  onClick={updateEmailJournal}
                />
              </div>
              {error && <div>Error: {error.message}</div>}
              {isLoading && <div>Loading...</div>}
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
