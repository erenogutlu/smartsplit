import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Fetch users from backend on component mount
    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle form submission to add a new user
    const handleAddUser = (e) => {
        e.preventDefault();

        const newUser = { name, email };

        fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then(response => response.json())
            .then(data => {
                setUsers([...users, data]); // Update UI with the new user
                setName('');
                setEmail('');
            })
            .catch(error => console.error("Error adding user:", error));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>SmartSplit Users</h1>

                <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '8px', borderRadius: '4px' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '8px', borderRadius: '4px' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                        Add User
                    </button>
                </form>

                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {users.map(user => (
                        <li key={user.id} style={{ margin: '10px 0', borderBottom: '1px solid #555', paddingBottom: '10px' }}>
                            <strong>{user.name}</strong> - {user.email}
                        </li>
                    ))}
                </ul>
            </header>
        </div>
    );
}

export default App;