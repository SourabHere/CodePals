import React, { useEffect, useState } from "react";
import "./dashboard/style.css";
import "./userPosts/style.css";
import { Link } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import CreditUsersDialog from "./CreditUsersDialog";

const UserPosts = () => {
  const { user } = useUser();
  const { userId } = useAuth();

  const [posts, setPosts] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [newRoomId, setNewRoomId] = useState("");
  const [newType, setNewType] = useState("Help Needed");
  const [newPriority, setNewPriority] = useState("Low");
  const [newTags, setNewTags] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortByDate, setSortByDate] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `http://localhost:3456/api/users/${userId}/posts`
      );
      const data = await response.json();

      const formattedData = data.map((post) => ({
        ...post,
        date_time: new Date(post.date_time).toLocaleString(),
      }));

      setPosts(formattedData);
    };

    const fetchPriorities = async () => {
      const response = await fetch(
        "http://localhost:3456/api/users/posts/priorities"
      );
      const data = await response.json();
      setPriorities(data);
    };

    fetchPosts();
    fetchPriorities();
  }, []);

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleResolve = async (postId, roomId) => {
    const response = await fetch(`http://localhost:3456/api/rooms/${roomId}`);
    const data = await response.json();
    setUsersInRoom(usersInRoom.concat(data));

    const post = posts.find((post) => post.id === postId);
    setSelectedPost(post);
    setIsCreditDialogOpen(true);
  };

  const creditUsersAndResolve = async (selectedUsers) => {
    const promises = selectedUsers.map((selectedUserId) =>
      fetch(`http://127.0.0.1:3456/api/users/community/${selectedUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    try {
      await Promise.all(promises);

      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id ? { ...post, resolved: true } : post
      );
      setPosts(updatedPosts);

      setIsCreditDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error crediting users:", error);
    }

    const resolvePost = await fetch(
      `http://127.0.0.1:3456/api/posts/resolve/${userId}/${selectedPost.id}`,
      {
        method: "PATCH",
      }
    );

    if (resolvePost.ok) {
      console.log(`Resolved post ${selectedPost.id}`);
    } else {
      console.error("Error resolving post");
      alert("Error resolving comment");
    }
  };

  const handleAddPost = () => {
    fetch(`http://localhost:3456/api/users/${userId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: newComment,
        room_id: newRoomId,
        date_time: formatDateTime(new Date()),
        type: newType,
        priority: newPriority,
        tags: newTags.split(",").map((tag) => tag.trim()),
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error posting comment");
        }
      })
      .then((newPost) => {
        const newPostFormatted = {
          ...newPost,
          date_time: new Date(newPost.date_time).toLocaleString(),
        };
        setPosts([...posts, newPostFormatted]);
        setIsModalOpen(false);
        setNewComment("");
        setNewRoomId("");
        setNewType("Help Needed");
        setNewPriority("Low");
        setNewTags("");
      })
      .catch((error) => {
        console.error("Error adding post:", error);
        alert("Error posting comment");
      });
  };

  const filteredPosts = posts.filter((post) => {
    const tagMatch = !filterTag || post.tags.includes(filterTag);
    const priorityMatch = !filterPriority || post.priority === filterPriority;
    return tagMatch && priorityMatch;
  });

  const sortedPosts = sortByDate
    ? [...filteredPosts].sort(
        (a, b) => new Date(a.date_time) - new Date(b.date_time)
      )
    : filteredPosts;

  return (
    <div className="dashboard-helper">
      <div className="user-comments-bar">
        <h2>Hi {user.firstName}, Check out your posts!!</h2>
        <div className="buttons-container">
          <button
            className="post-comment-button"
            onClick={() => setIsModalOpen(true)}
          >
            Post a Thread
          </button>
          <div className="filter-container">
            <input
              className="filter-input"
              type="text"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              placeholder="Filter by tag"
            />
            <select
              className="filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <Link to="/connect">
            <button className="apply-filters-button">Join Room</button>
          </Link>
        </div>
      </div>
      <div className="comments-container">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className={`comment-box priority-${post.priority.toLowerCase()} ${
              post.resolved ? "resolved" : ""
            }`}
          >
            <div className="comment-header">
              <p className="user-name">
                <img
                  src={post.logoURL || "/CodePalsHeader.png"}
                  alt={`${post.name}'s avatar`}
                  className="user-avatar"
                />
                You
              </p>
              <p className="comment-datetime">{post.date_time}</p>
            </div>
            <p className="user-comment">{post.comment}</p>
            <div className="comment-details-user-post">
              <div className="comment-details-left">
                <p className="comment-type">Type: {post.type}</p>
                <p className="comment-priority">Priority: {post.priority}</p>
                <p className="comment-tags">Tags: {post.tags.join(", ")}</p>
                {post.room_id && (
                  <p className="room-id">Room ID: {post.room_id}</p>
                )}
              </div>

              <div className="comment-details-right">
                {!post.resolved && (
                  <button
                    className="resolve-button"
                    onClick={() => handleResolve(post.id, post.room_id)}
                  >
                    Resolve
                  </button>
                )}
                {post.resolved ? (
                  <button className="resolved-button" disabled>
                    Resolved
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <h3>Post a Thread</h3>
            <textarea
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add Your Description"
            />
            <input
              className="room-id-input"
              type="text"
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              placeholder="Room ID (optional)"
            />
            <select
              className="type-select"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="Help Needed">Help Needed</option>
              <option value="General Discussion">General Discussion</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
            </select>
            <select
              className="priority-select"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              className="tags-input"
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (comma separated)"
            />
            <button className="add-comment-button" onClick={handleAddPost}>
              Add Thread
            </button>
          </div>
        </div>
      )}

      {selectedPost && isCreditDialogOpen && (
        <CreditUsersDialog
          usersInRoom={usersInRoom}
          currentUserId={userId}
          setUsersInRoom={setUsersInRoom}
          onCreditUsers={creditUsersAndResolve}
          setIsCreditDialogOpen={setIsCreditDialogOpen}
        />
      )}
    </div>
  );
};

export default UserPosts;
