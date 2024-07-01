import React, { useState } from "react";
import "./dashboard/style.css";

const DashboardHelper = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "John Doe",
      comment: "Help needed with React hooks!",
      roomId: "12345",
      dateTime: new Date().toLocaleString(),
      type: "Help Needed",
      priority: "High",
      tags: ["React", "Hooks"],
    },
    {
      id: 2,
      user: "Jane Smith",
      comment: "How do I use useEffect?",
      roomId: "67890",
      dateTime: new Date().toLocaleString(),
      type: "General Discussion",
      priority: "Medium",
      tags: ["React", "useEffect"],
    },
    {
      id: 3,
      user: "Sourab ",
      comment: "How do I use recover lost DSA memory?",
      roomId: "67890abcd",
      dateTime: new Date().toLocaleString(),
      type: "General Discussion",
      priority: "Low",
      tags: ["C++", "Python"],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [newRoomId, setNewRoomId] = useState("");
  const [newType, setNewType] = useState("Help Needed");
  const [newPriority, setNewPriority] = useState("Low");
  const [newTags, setNewTags] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortByDate, setSortByDate] = useState(false);

  const handleAddComment = () => {
    const newCommentObj = {
      id: comments.length + 1,
      user: "Current User",
      comment: newComment,
      roomId: newRoomId,
      dateTime: new Date().toLocaleString(),
      type: newType,
      priority: newPriority,
      tags: newTags.split(",").map((tag) => tag.trim()),
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
    setNewRoomId("");
    setNewType("Help Needed");
    setNewPriority("Low");
    setNewTags("");
    setIsModalOpen(false);
  };

  const handleApplyFilters = () => {
    setSortByDate(!sortByDate);
  };

  const filteredComments = comments.filter((comment) => {
    const tagMatch = !filterTag || comment.tags.includes(filterTag);
    const priorityMatch =
      !filterPriority || comment.priority === filterPriority;
    return tagMatch && priorityMatch;
  });

  const sortedComments = sortByDate
    ? [...filteredComments].sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      )
    : filteredComments;

  return (
    <div className="dashboard-helper">
      <div className="user-comments-bar">
        <h2>Hi User, Check if you can help someone today!!</h2>
        <div className="buttons-container">
          <button
            className="post-comment-button"
            onClick={() => setIsModalOpen(true)}
          >
            Post a Comment
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
          <button className="apply-filters-button" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
      <div className="comments-container">
        {sortedComments.map((comment) => (
          <div
            key={comment.id}
            className={`comment-box priority-${comment.priority.toLowerCase()}`}
          >
            <div className="comment-header">
              <p className="user-name">{comment.user}</p>
              <p className="comment-datetime">{comment.dateTime}</p>
            </div>
            <p className="user-comment">{comment.comment}</p>
            <div className="comment-details">
              <p className="comment-type">Type: {comment.type}</p>
              <p className="comment-priority">Priority: {comment.priority}</p>
              <p className="comment-tags">Tags: {comment.tags.join(", ")}</p>
              {comment.roomId && (
                <p className="room-id">Room ID: {comment.roomId}</p>
              )}
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
            <h3>Post a Comment</h3>
            <textarea
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment"
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
            <button className="add-comment-button" onClick={handleAddComment}>
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHelper;
