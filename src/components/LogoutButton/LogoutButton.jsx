import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import './LogoutButton.css'

const LogoutButton = ({ handleLogout }) => {
  return (
    <li className="logout-button" onClick={handleLogout}>
      <p><FontAwesomeIcon icon={faRightFromBracket} /> Log out</p>
    </li>
  );
}; 

export default LogoutButton;
 