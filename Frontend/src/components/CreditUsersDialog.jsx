import React, { useState } from "react";
import "./creditUsersDialog/style.css";

const CreditUsersDialog = ({
  usersInRoom,
  currentUserId,
  onCreditUsers,
  setIsCreditDialogOpen,
  setUsersInRoom,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreditUsers = () => {
    onCreditUsers(selectedUsers);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="credit-dialog-overlay">
      <div className="credit-dialog">
        <h3>Select Users to Credit</h3>
        <ul>
          {usersInRoom &&
            usersInRoom.map((user) => (
              <li
                key={user.id}
                className={`${
                  user.user_id === currentUserId ? "disabled" : ""
                }`}
              >
                <label>
                  <input
                    type="checkbox"
                    disabled={user.user_id === currentUserId}
                    checked={selectedUsers.includes(user.user_id)}
                    onChange={() => handleCheckboxChange(user.user_id)}
                  />
                  <div className="user-info-credit">
                    <div className="user-details-resolve">
                      <div className="user-name">
                        <img src={user.logoURL} alt={user.name} />
                        {user.user_id !== currentUserId ? user.name : "You"}
                      </div>
                      <div className="join-date">
                        {formatDate(user.dateOfJoin)}
                      </div>
                    </div>
                  </div>
                </label>
              </li>
            ))}
        </ul>
        <div className="credit-dialog-footer">
          <button className="credit-button" onClick={handleCreditUsers}>
            Credit Selected Users
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setIsCreditDialogOpen(false);
              setSelectedUsers([]);
              setUsersInRoom([]);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditUsersDialog;
