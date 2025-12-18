import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Login/Sign Up Page Component
const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      setError('');
      onLogin({ email, username: data.user?.username || email.split('@')[0], token: data.token });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setError('✅ Account created successfully! Please log in.');
      setTimeout(() => {
        setIsSignUp(false);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      isSignUp ? handleSignUp() : handleLogin();
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1a2942',
        borderRadius: '16px',
        padding: '48px',
        width: '90%',
        maxWidth: '450px',
        border: '2px solid #00d4ff',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
        animation: 'fadeIn 0.6s ease-in'
      }}>
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <h1 style={{
          fontSize: '40px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 12px 0',
          textAlign: 'center'
        }}>
          📋
        </h1>
        
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '12px 0 8px 0',
          textAlign: 'center'
        }}>
          Kanban Board
        </h2>

        <p style={{
          fontSize: '14px',
          color: '#a8b8d8',
          margin: '0 0 32px 0',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          {isSignUp ? 'Create your account' : 'Organize your tasks efficiently with our modern kanban board'}
        </p>

        {isSignUp && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="John Doe"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #00d4ff',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#0a1929',
                color: '#ffffff',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                outline: 'none',
                opacity: loading ? 0.6 : 1
              }}
              onFocus={(e) => !loading && (e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.5)')}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="you@example.com"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #00d4ff',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#0a1929',
              color: '#ffffff',
              boxSizing: 'border-box',
              transition: 'all 0.3s',
              outline: 'none',
              opacity: loading ? 0.6 : 1
            }}
            onFocus={(e) => !loading && (e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.5)')}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          />
        </div>

        <div style={{ marginBottom: isSignUp ? '20px' : '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="••••••••"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #00d4ff',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#0a1929',
              color: '#ffffff',
              boxSizing: 'border-box',
              transition: 'all 0.3s',
              outline: 'none',
              opacity: loading ? 0.6 : 1
            }}
            onFocus={(e) => !loading && (e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.5)')}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          />
        </div>

        {isSignUp && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #00d4ff',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#0a1929',
                color: '#ffffff',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                outline: 'none',
                opacity: loading ? 0.6 : 1
              }}
              onFocus={(e) => !loading && (e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.5)')}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: error.includes('successfully') ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
            border: error.includes('successfully') ? '1px solid #28a745' : '1px solid #dc3545',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            color: error.includes('successfully') ? '#5bde5b' : '#ff6b6b',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={isSignUp ? handleSignUp : handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#999999' : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
            transition: 'all 0.3s',
            marginBottom: '16px'
          }}
          onMouseOver={(e) => !loading && (e.target.style.boxShadow = '0 6px 24px rgba(0, 212, 255, 0.5)')}
          onMouseOut={(e) => !loading && (e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)')}
        >
          {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        <p style={{
          fontSize: '13px',
          color: '#a8b8d8',
          textAlign: 'center',
          margin: '16px 0',
          lineHeight: '1.6'
        }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => {
              if (!loading) {
                setIsSignUp(!isSignUp);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }
            }}
            style={{
              color: '#00d4ff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textDecoration: 'underline',
              opacity: loading ? 0.6 : 1
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onDelete, onEdit, onMoveTask, themeColors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSave = () => {
    onEdit(task.id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  const priorityColors = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#dc3545'
  };

  return (
    <div style={{
      backgroundColor: themeColors.cardBackground,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: `0 4px 12px ${themeColors.shadowColor}`,
      border: `1.5px solid ${themeColors.borderColor}`,
      color: themeColors.textColor
    }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: themeColors.inputBackground,
              color: themeColors.textColor
            }}
          />
          <textarea
            rows="2"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              backgroundColor: themeColors.inputBackground,
              color: themeColors.textColor
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#404853',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h6 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>
            {task.title}
          </h6>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#a8b8d8', lineHeight: '1.4' }}>
            {task.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              backgroundColor: priorityColors[task.priority],
              color: 'white'
            }}>
              {task.priority}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '5px 12px',
                  backgroundColor: 'white',
                  color: '#007bff',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                style={{
                  padding: '5px 12px',
                  backgroundColor: 'white',
                  color: '#dc3545',
                  border: '1px solid #dc3545',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <select 
            value={task.status}
            onChange={(e) => onMoveTask(task.id, e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '2px solid #00d4ff',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: '#0f3460',
              color: '#ffffff',
              fontWeight: '500'
            }}
          >
            <option value="todo">Move to To Do</option>
            <option value="inprogress">Move to In Progress</option>
            <option value="done">Move to Done</option>
          </select>
        </>
      )}
    </div>
  );
};

// Column Component
const Column = ({ title, tasks, onDelete, onEdit, onMoveTask, color, themeColors }) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        backgroundColor: themeColors.columnBackground,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `2px solid ${themeColors.borderColor}`,
        height: '100%',
        boxShadow: `0 8px 32px ${themeColors.shadowColor}`
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: 'white',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {title}
          </h5>
          <span style={{
            backgroundColor: 'white',
            color: '#212529',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {tasks.length}
          </span>
        </div>
        <div style={{
          padding: '16px',
          minHeight: '500px',
          maxHeight: '600px',
          overflowY: 'auto',
          backgroundColor: themeColors.pageBackground
        }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onMoveTask={onMoveTask}
              themeColors={themeColors}
            />
          ))}
          {tasks.length === 0 && (
            <p style={{ textAlign: 'center', color: themeColors.secondaryText, marginTop: '40px', fontSize: '14px' }}>
              No tasks yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Task Modal Component
const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd({ title, description, priority, status });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1a2942',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '2px solid #00d4ff',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h5 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>Add New Task</h5>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#a8b8d8',
              padding: '0',
              width: '30px',
              height: '30px'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #00d4ff',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#0a1929',
              color: '#ffffff'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
            Description
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #00d4ff',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              backgroundColor: '#0a1929',
              color: '#ffffff'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #00d4ff',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#0f3460',
              color: '#ffffff'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #00d4ff',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#0f3460',
              color: '#ffffff'
            }}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#404853',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#505863'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#404853'}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Home/Kanban Board Component
const HomePage = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup Project', description: 'Initialize React project with Vite', priority: 'high', status: 'done' },
    { id: 2, title: 'Design UI', description: 'Create mockups for the application', priority: 'medium', status: 'inprogress' },
    { id: 3, title: 'Write Tests', description: 'Add unit tests for components', priority: 'low', status: 'todo' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const themeColors = isDarkMode ? {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    pageBackground: '#16213e',
    cardBackground: '#1a2942',
    columnBackground: '#0f3460',
    inputBackground: '#0a1929',
    textColor: '#ffffff',
    secondaryText: '#a8b8d8',
    borderColor: '#00d4ff',
    buttonGradient: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
    shadowColor: 'rgba(0, 212, 255, 0.3)'
  } : {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
    pageBackground: '#ffffff',
    cardBackground: '#ffffff',
    columnBackground: '#f8f9fa',
    inputBackground: '#ffffff',
    textColor: '#2c3e50',
    secondaryText: '#7f8c8d',
    borderColor: '#3498db',
    buttonGradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    shadowColor: 'rgba(52, 152, 219, 0.2)'
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newTitle, newDescription) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, title: newTitle, description: newDescription }
        : task
    ));
  };

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div style={{
      background: themeColors.background,
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: themeColors.textColor,
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📋 Kanban Board
            </h1>
            <p style={{
              fontSize: '14px',
              color: themeColors.secondaryText,
              margin: 0
            }}>
              Welcome, {user.username}!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '12px 24px',
                backgroundColor: isDarkMode ? '#404853' : '#e0e6ed',
                color: isDarkMode ? 'white' : '#2c3e50',
                border: `2px solid ${themeColors.borderColor}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
              title="Toggle Theme"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '12px 24px',
                background: themeColors.buttonGradient,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: `0 4px 15px ${themeColors.shadowColor}`,
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = `0 6px 20px ${themeColors.shadowColor}`}
              onMouseOut={(e) => e.target.style.boxShadow = `0 4px 15px ${themeColors.shadowColor}`}
            >
              + Add Task
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '12px 24px',
                backgroundColor: isDarkMode ? '#404853' : '#e0e6ed',
                color: isDarkMode ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = isDarkMode ? '#505863' : '#d0d8e0'}
              onMouseOut={(e) => e.target.style.backgroundColor = isDarkMode ? '#404853' : '#e0e6ed'}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          width: '100%'
        }}>
          <Column
            title="📝 To Do"
            tasks={todoTasks}
            color="#6c757d"
            onDelete={deleteTask}
            onEdit={editTask}
            onMoveTask={moveTask}
            themeColors={themeColors}
          />
          <Column
            title="🚀 In Progress"
            tasks={inProgressTasks}
            color="#007bff"
            onDelete={deleteTask}
            onEdit={editTask}
            onMoveTask={moveTask}
            themeColors={themeColors}
          />
          <Column
            title="✅ Done"
            tasks={doneTasks}
            color="#28a745"
            onDelete={deleteTask}
            onEdit={editTask}
            onMoveTask={moveTask}
            themeColors={themeColors}
          />
        </div>

        <AddTaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addTask}
        />
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return isLoggedIn ? (
    <HomePage user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}
