import { Link } from "react-router-dom";
import "./NavBar.css";
import useAuth from "../../hooks/useAuth";

export default function NavBar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { logout } = useAuth();
  return (
    <nav>
      <ul>
        {/* always display Home irrespectable of wether signed in*/}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* conditionally display login/register or profile/logout */}
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/entries">Entries</Link>
            </li>
            <li>
              <Link to="/create-entry">Create</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>{" "}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
