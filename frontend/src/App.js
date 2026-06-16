import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // States for Users
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // States for Expenses
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState('');

    // NEW: State for multiple participants
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    // State for Balances (Settlements)
    const [balances, setBalances] = useState({});

    // Fetch all data on component mount
    useEffect(() => {
        fetchUsers();
        fetchExpenses();
        fetchBalances();
    }, []);

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error fetching users:", err));
    };

    const fetchExpenses = () => {
        fetch('http://localhost:8080/api/expenses')
            .then(res => res.json())
            .then(data => setExpenses(data))
            .catch(err => console.error("Error fetching expenses:", err));
    };

    const fetchBalances = () => {
        fetch('http://localhost:8080/api/expenses/balances')
            .then(res => res.json())
            .then(data => setBalances(data))
            .catch(err => console.error("Error fetching balances:", err));
    };

    // Handle new user submission
    const handleAddUser = (e) => {
        e.preventDefault();
        const newUser = { name, email };

        fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        })
            .then(res => res.json())
            .then(data => {
                setUsers([...users, data]);
                setName('');
                setEmail('');
                fetchBalances();
            })
            .catch(err => console.error("Error adding user:", err));
    };

    // NEW: Handle checkbox toggle for participants
    const handleCheckboxChange = (userId) => {
        setSelectedParticipants(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId) // Remove if already checked
                : [...prev, userId]                // Add if not checked
        );
    };

    // NEW: Smart Default - Auto-check the payer
    const handlePayerChange = (e) => {
        const selectedId = e.target.value;
        setPayerId(selectedId); // 1. Açılır menüyü güncelle

        const numericId = parseInt(selectedId);
        // 2. Eğer bu kişi zaten işaretli değilse, onu otomatik olarak listeye ekle
        if (!selectedParticipants.includes(numericId)) {
            setSelectedParticipants(prev => [...prev, numericId]);
        }
    };

    // Handle new expense submission
    const handleAddExpense = (e) => {
        e.preventDefault();

        // Validation: At least one participant must be selected
        if (selectedParticipants.length === 0) {
            alert("Please select at least one participant to share the expense!");
            return;
        }

        // Format data exactly how Spring Boot expects it (@ManyToMany)
        const newExpense = {
            description,
            amount: parseFloat(amount),
            paidBy: { id: parseInt(payerId) },
            participants: selectedParticipants.map(id => ({ id: id }))
        };

        fetch('http://localhost:8080/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newExpense),
        })
            .then(res => res.json())
            .then(data => {
                setExpenses([...expenses, data]);
                // Reset form
                setDescription('');
                setAmount('');
                setPayerId('');
                setSelectedParticipants([]);
                fetchBalances();
            })
            .catch(err => console.error("Error adding expense:", err));
    };

    const handleDeleteExpense = (id) => {
        fetch(`http://localhost:8080/api/expenses/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                fetchExpenses();
                fetchBalances();
            })
            .catch(err => console.error("Error deleting expense:", err));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>SmartSplit</h1>

                {/* --- USERS SECTION --- */}
                <h2>Users</h2>
                <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={btnStyle}>Add User</button>
                </form>

                <ul style={listStyle}>
                    {users.map(u => (
                        <li key={u.id} style={listItemStyle}>
                            <strong>{u.name}</strong> - {u.email}
                        </li>
                    ))}
                </ul>

                {/* --- EXPENSES SECTION --- */}
                <h2 style={{ marginTop: '40px' }}>Expenses</h2>
                <form onSubmit={handleAddExpense} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={inputStyle} />
                        <input type="number" step="0.01" placeholder="Amount (€)" value={amount} onChange={e => setAmount(e.target.value)} required style={inputStyle} />
                            <select value={payerId} onChange={handlePayerChange} required style={inputStyle}>
                            <option value="" disabled>Who Paid?</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* NEW: Checkboxes for Participants */}
                    <div style={{ backgroundColor: '#282c34', padding: '10px', borderRadius: '8px', border: '1px solid #555', width: '100%', maxWidth: '400px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#61dafb' }}>Who shares this expense?</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                            {users.map(u => (
                                <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedParticipants.includes(u.id)}
                                        onChange={() => handleCheckboxChange(u.id)}
                                    />
                                    {u.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" style={{...btnStyle, marginTop: '10px'}}>Add Expense</button>
                </form>

                <ul style={listStyle}>
                    {expenses.map(exp => (
                        <li key={exp.id} style={{ ...listItemStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{exp.description}</strong> - €{exp.amount} <br/>
                                <small style={{ color: '#aaa' }}>Paid by: {exp.paidBy?.name}</small><br/>
                                {/* Show who participated */}
                                <small style={{ color: '#888' }}>
                                    Shared with: {exp.participants?.map(p => p.name).join(', ') || 'None'}
                                </small>
                            </div>
                            <button onClick={() => handleDeleteExpense(exp.id)} style={deleteBtnStyle}>X</button>
                        </li>
                    ))}
                </ul>

                {/* --- SETTLEMENTS SECTION --- */}
                <h2 style={{ marginTop: '40px', color: '#ffeb3b' }}>Settlements</h2>
                <ul style={listStyle}>
                    {Object.entries(balances).map(([userName, balance]) => (
                        <li key={userName} style={listItemStyle}>
                            <strong>{userName}</strong>:
                            <span style={{
                                color: balance > 0 ? '#4caf50' : balance < 0 ? '#f44336' : '#9e9e9e',
                                fontWeight: 'bold', marginLeft: '10px'
                            }}>
                                {balance > 0 ? `Gets €${balance}` : balance < 0 ? `Owes €${Math.abs(balance)}` : 'Settled'}
                            </span>
                        </li>
                    ))}
                </ul>

            </header>
        </div>
    );
}

// Styles
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#61dafb', border: 'none', fontWeight: 'bold', color: '#282c34' };
const deleteBtnStyle = { backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' };
const listStyle = { listStyleType: 'none', padding: 0, width: '100%', maxWidth: '500px', textAlign: 'left', margin: '0 auto' };
const listItemStyle = { margin: '10px 0', borderBottom: '1px solid #555', paddingBottom: '10px' };

export default App;