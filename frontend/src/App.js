import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const createUser = async () => {
    if (!newUsername) return;
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername }),
      });
      const data = await res.json();
      setUser(data);
      setNewUsername('');
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const createPost = async () => {
    if (!user || !newPost) return;
    try {
      await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content: newPost }),
      });
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const likePost = async (postId) => {
    try {
      await fetch(`${API_URL}/api/posts/${postId}/like`, { method: 'POST' });
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const addComment = async (postId) => {
    if (!user || !newComment[postId]) return;
    try {
      await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content: newComment[postId] }),
      });
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const toggleComments = (postId) => {
    if (comments[postId]) {
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[postId];
        return newComments;
      });
    } else {
      fetchComments(postId);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🌟 MiniSocial</h1>
        {user && <div className="user-info">Logged in as: {user.username}</div>}
      </header>

      <div className="container">
        {!user ? (
          <div className="login-box">
            <h2>Join MiniSocial</h2>
            <input
              type="text"
              placeholder="Enter username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button onClick={createUser}>Create Account</button>
            
            {users.length > 0 && (
              <div className="existing-users">
                <h3>Or login as:</h3>
                {users.map(u => (
                  <button key={u.id} onClick={() => setUser(u)} className="user-btn">
                    {u.username}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="create-post">
              <textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button onClick={createPost}>Post</button>
              <button onClick={() => setUser(null)} className="logout-btn">Logout</button>
            </div>

            <div className="posts">
              {posts.map(post => (
                <div key={post.id} className="post">
                  <div className="post-header">
                    <strong>{post.username}</strong>
                    <span className="post-time">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-actions">
                    <button onClick={() => likePost(post.id)}>
                      ❤️ {post.likes}
                    </button>
                    <button onClick={() => toggleComments(post.id)}>
                      💬 Comments
                    </button>
                  </div>
                  
                  {comments[post.id] && (
                    <div className="comments">
                      {comments[post.id].map(comment => (
                        <div key={comment.id} className="comment">
                          <strong>{comment.username}</strong>: {comment.content}
                        </div>
                      ))}
                      <div className="add-comment">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        />
                        <button onClick={() => addComment(post.id)}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
