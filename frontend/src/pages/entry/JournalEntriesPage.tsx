import useApi from "../../api/useApi";
import useUserContext from "../../hooks/useUserContext";
import { useEffect, useState } from "react";
import { sortEntriesByDate } from "./sortEntries";
import { useNavigate } from "react-router-dom";

export interface Entry {
  entry_id: number;
  title: string;
  content: string;
  creation_date: string;
}

export default function JournalEntriesPage() {
  const { user } = useUserContext();
  const myToken = user?.authToken;

  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState("desc");
  const [entries, setEntries] = useState<Entry[] | null>(
    localStorage.getItem("journalEntries")
      ? JSON.parse(localStorage.getItem("journalEntries") as string)
      : null
  );

  // Add state for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the array of entries to get only the items for the current page, empty array if no entries
  const currentItems = sortEntriesByDate(entries, sortOrder).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate the total number of pages
  const totalPages = entries ? Math.ceil(entries.length / itemsPerPage) : 1;

  // Add handlers for the pagination buttons
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  // defining how to fetch data from my API and the format to put it in
  const { isLoading, error, data, fetchData } = useApi<Entry[]>({
    url: "/entry/getEntries/",
    method: "get",
    headers: {
      Authorization: `Token ${myToken}`,
    },
  });
  console.log("user", user);

  if (user === null || user === undefined) {
    return (
      <>
        <div>You are not logged in please either login or register</div>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </>
    );
  }

  async function updateEntries() {
    await fetchData();
    localStorage.setItem("journalEntries", JSON.stringify(data));
    entries && setEntries(data);
  }

  // check local storage to see if we already have journal data:
  useEffect(() => {
    if (data !== null) {
      setEntries(data);
      localStorage.setItem("journalEntries", JSON.stringify(data));
    }
  }, [data]);

  // if we have journal data in local storage, use that, otherwise use the data from the API
  if (entries === null) {
    return (
      <>
        <div>No entries found</div>
        <button onClick={updateEntries}>Update Entries</button>
      </>
    );
  } else {
    return (
      <>
        <h1>Journal Entries</h1>
        <div>
          <button onClick={updateEntries}>Update Entries</button>

          <h2>Sort by Date</h2>
          <button onClick={() => setSortOrder("desc")}>Desending</button>
          <button onClick={() => setSortOrder("asc")}>Ascending</button>
        </div>
        <ul>
          {sortEntriesByDate(currentItems, sortOrder).map((post) => (
            <li key={post.entry_id}>
              <h2>{post.title}</h2>
              <p>
                date: {post.creation_date}
                <br />
                {post.content}
              </p>
            </li>
          ))}
        </ul>
        <div>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button onClick={goToPreviousPage}>Previous</button>
          <button onClick={goToNextPage}>Next</button>
        </div>
        {error && <div>Error: {error.message}</div>}
        {isLoading && <div>Loading...</div>}
      </>
    );
  }
}
