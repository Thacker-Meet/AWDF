import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

const API_URL = "http://localhost:3000/tasks";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newCompleted, setNewCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Edit task state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCompleted, setEditCompleted] = useState(false);

  // Fetch tasks from Express + MongoDB backend
  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch tasks (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load tasks from server.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle task creation (POST /tasks) - new tasks default to pending (completed: false)
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError("Task title is required.");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        completed: false,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        return res.json();
      })
      .then((createdTask) => {
        // Update state without manual refresh
        setTasks((prevTasks) => [createdTask, ...prevTasks]);
        setNewTitle("");
        setNewDescription("");
        setNewPriority("medium");
      })
      .catch((err) => {
        setFormError(`Failed to create task: ${err.message}`);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Handle task completion toggle (PUT /tasks/:id) - completed tasks cannot be set back to pending
  const handleToggleComplete = (task) => {
    if (task.completed) {
      return; // Already completed, cannot revert to pending
    }

    fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: true,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update status");
        }
        return res.json();
      })
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      })
      .catch((err) => {
        alert(`Error updating task status: ${err.message}`);
      });
  };

  // Start editing a task (only allowed if task is not completed)
  const startEditing = (task) => {
    if (task.completed) {
      return; // Completed tasks cannot be edited
    }
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "medium");
    setEditCompleted(task.completed || false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Handle task update submit (PUT /tasks/:id)
  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        completed: editCompleted,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update task");
        }
        return res.json();
      })
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
        setEditingId(null);
      })
      .catch((err) => {
        alert(`Error updating task: ${err.message}`);
      });
  };

  // Handle task deletion (DELETE /tasks/:id)
  const handleDeleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        return res.json();
      })
      .then(() => {
        // Update task list without browser refresh
        setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      })
      .catch((err) => {
        alert(`Error deleting task: ${err.message}`);
      });
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="section">
      <h2>Task Management System</h2>
      <p className="section-subtitle">
        Powered by Express + MongoDB REST API backend
      </p>

      {/* Form to Add New Task */}
      <div className="task-form-container">
        <h3>Create New Task</h3>
        {formError && <ErrorMessage message={formError} />}
        <form onSubmit={handleCreateTask} className="task-form">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              placeholder="Enter task description (optional)..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Adding Task..." : "Add Task"}
          </button>
        </form>
      </div>

      <hr className="section-divider" />

      {/* Task List Section */}
      <div className="github-repos-section">
        <h3>Tasks List</h3>

        {!error && !loading && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        {loading && <Spinner message="Loading tasks..." />}

        {error && (
          <div className="error-container">
            <ErrorMessage message={error} />
            <button onClick={fetchTasks} className="btn-retry">
              Retry Fetching Tasks
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="projects-grid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`project-card ${
                    task.completed ? "task-completed-card" : ""
                  }`}
                >
                  {editingId === task._id ? (
                    /* Inline Edit Form */
                    <form onSubmit={handleUpdateTask} className="task-edit-form">
                      <div className="form-group">
                        <label>Title:</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description:</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Priority:</label>
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                      <div className="action-buttons">
                        <button type="submit" className="btn-save">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Task Item Display */
                    <>
                      <div className="project-card-header">
                        <div className="repo-title-container">
                          <h3 className={task.completed ? "strikethrough" : ""}>
                            {task.title}
                          </h3>
                          <span
                            className={`badge badge-${task.priority}`}
                          >
                            {task.priority ? task.priority.toUpperCase() : "MEDIUM"}
                          </span>
                          <span
                            className={`badge ${
                              task.completed ? "badge-completed" : "badge-pending"
                            }`}
                          >
                            {task.completed ? "COMPLETED" : "PENDING"}
                          </span>
                        </div>
                      </div>

                      <p className="task-description">
                        {task.description || "No description provided."}
                      </p>

                      <div className="task-footer">
                        <span className="project-tech">
                          Created:{" "}
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleString()
                            : "N/A"}
                        </span>

                        <div className="action-buttons">
                          {!task.completed ? (
                            <>
                              <button
                                onClick={() => handleToggleComplete(task)}
                                className="btn-action btn-complete"
                                title="Mark task as completed"
                              >
                                Mark Complete
                              </button>
                              <button
                                onClick={() => startEditing(task)}
                                className="btn-action btn-edit"
                                title="Edit task"
                              >
                                Edit
                              </button>
                            </>
                          ) : (
                            <span className="task-done-label">
                              Completed
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="btn-action btn-delete"
                            title="Delete task"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="no-results">
                {searchQuery
                  ? `No tasks found matching "${searchQuery}"`
                  : "No tasks found in database. Create one using the form above!"}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Tasks;
