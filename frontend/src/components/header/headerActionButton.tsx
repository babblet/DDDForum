import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

export const HeaderActionButton: React.FC = () => {
  const user = useUser().user
  return (
  <div id="header-action-button">
    {user ? (
      <div>
        <div>{user.username}</div>
        <u>
          <div>logout</div>
        </u>
      </div>
    ) : (
      <Link to="/join">Join</Link>
    )}
  </div>
  );
}
