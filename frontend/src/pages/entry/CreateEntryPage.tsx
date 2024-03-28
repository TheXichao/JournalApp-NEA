import { useState } from "react";
import useApi from "../../api/useApi";
import useUserContext from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";

interface requestFeedback {
  message: string;
}

export default function CreateEntryPage() {
  const { user } = useUserContext();
  const myToken = user?.authToken;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const { isLoading, error, data, fetchData } = useApi<requestFeedback>({
    url: "/entry/createEntry/",
    method: "POST",
    data: {
      title,
      content,
    },
    headers: {
      Authorization: `Token ${myToken}`,
    },
  });

  if (user === null || user === undefined) {
    return (
      <>
        <div>You are not logged in please either login or register</div>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </>
    );
  }

  const onCreateEntry = () => {
    fetchData();
    console.log("Creating entry...");
    if (data) {
      navigate("/entries");
    }
  };

  return (
    <div>
      <h1>Create Journal Entry</h1>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      {error && <div>Error: {error.message}</div>}
      {isLoading && <div>Loading...</div>}
      {data && <div>{data.message}</div>}
      <input type="submit" value="Create Entry" onClick={onCreateEntry} />
    </div>
  );
}
