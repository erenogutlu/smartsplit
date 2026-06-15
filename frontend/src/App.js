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

    // State for Balances (Settlements)
    const [balances, setBalances] = useState({}); // New!

    // Fetch all data on component mount
    useEffect(() => {
        fetchUsers();
        fetchExpenses();
        fetchBalances(); // New!
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

    // Fetch calculated balances from backend
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
                fetchBalances(); // Recalculate balances if a new user joins
            })
            .catch(err => console.error("Error adding user:", err));
    };

    // Handle new expense submission
    const handleAddExpense = (e) => {
        e.preventDefault();

        const newExpense = {
            description,
            amount: parseFloat(amount),
            paidBy: { id: parseInt(payerId) }
        };

        fetch('http://localhost:8080/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newExpense),
        })
            .then(res => res.json())
            .then(data => {
                setExpenses([...expenses, data]);
                setDescription('');
                setAmount('');
                setPayerId('');
                fetchBalances(); // Recalculate balances immediately after a new expense!
            })
            .catch(err => console.error("Error adding expense:", err));
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
                <form onSubmit={handleAddExpense} style={{ marginBottom: '20px' }}>
                    <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={inputStyle} />
                    <input type="number" step="0.01" placeholder="Amount (€)" value={amount} onChange={e => setAmount(e.target.value)} required style={inputStyle} />

                    <select value={payerId} onChange={e => setPayerId(e.target.value)} required style={inputStyle}>
                        <option value="" disabled>Select Payer</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>

                    <button type="submit" style={btnStyle}>Add Expense</button>
                </form>

                <ul style={listStyle}>
                    {expenses.map(exp => (
                        <li key={exp.id} style={listItemStyle}>
                            <strong>{exp.description}</strong> - €{exp.amount} <br/>
                            <small style={{ color: '#aaa' }}>Paid by: {exp.paidBy?.name}</small>
                        </li>
                    ))}
                </ul>

                {/* --- SETTLEMENTS (BALANCES) SECTION --- */}
                <h2 style={{ marginTop: '40px', color: '#ffeb3b' }}>Settlements</h2>
                <ul style={listStyle}>
                    {/* Convert JSON Object to an Array to map over it */}
                    {Object.entries(balances).map(([userName, balance]) => (
                        <li key={userName} style={listItemStyle}>
                            <strong>{userName}</strong>:
                            <span style={{
                                color: balance > 0 ? '#4caf50' : balance < 0 ? '#f44336' : '#9e9e9e',
                                fontWeight: 'bold',
                                marginLeft: '10px'
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

// Reusable inline styles
const inputStyle = { marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#61dafb', border: 'none', fontWeight: 'bold', color: '#282c34' };
const listStyle = { listStyleType: 'none', padding: 0, width: '100%', maxWidth: '500px', textAlign: 'left', margin: '0 auto' };
const listItemStyle = { margin: '10px 0', borderBottom: '1px solid #555', paddingBottom: '10px' };

export default App;