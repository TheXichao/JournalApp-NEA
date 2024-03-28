import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const goToCreateEntry = () => {
    console.log("Go to create entry");
    navigate("/create-entry");
  };
  const goToViewEntries = () => {
    console.log("Go to view entries");
    navigate("/entries");
  };

  return (
    <div className="home-page">
      <h1>Home</h1>
      <p>Welcome to the home page</p>
      <button onClick={goToCreateEntry}>Create Entry</button>
      <button onClick={goToViewEntries}>View Entries</button>
    </div>
  );
}

export default HomePage;
