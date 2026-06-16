import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // 1. States for Users
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // 2. States for Normal Expenses
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    // 3. States for Balances
    const [balances, setBalances] = useState({});

    // 4. NEW: States for Settle Up (Borç Kapatma)
    const [settlePayerId, setSettlePayerId] = useState('');
    const [settleReceiverId, setSettleReceiverId] = useState('');
    const [settleAmount, setSettleAmount] = useState('');

    // --- FETCH DATA ---
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

    // --- HANDLERS ---
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
            });
    };

    const handleCheckboxChange = (userId) => {
        setSelectedParticipants(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handlePayerChange = (e) => {
        const selectedId = e.target.value;
        setPayerId(selectedId);
        const numericId = parseInt(selectedId);
        if (!selectedParticipants.includes(numericId)) {
            setSelectedParticipants(prev => [...prev, numericId]);
        }
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (selectedParticipants.length === 0) {
            alert("Please select at least one participant!");
            return;
        }

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
                setDescription('');
                setAmount('');
                setPayerId('');
                setSelectedParticipants([]);
                fetchBalances();
            });
    };

    const handleDeleteExpense = (id) => {
        fetch(`http://localhost:8080/api/expenses/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                fetchExpenses();
                fetchBalances();
            });
    };

    // NEW: Handle Settle Up
    const handleSettleUp = (e) => {
        e.preventDefault();

        if (settlePayerId === settleReceiverId) {
            alert("You cannot settle up with yourself!");
            return;
        }

        // We create a special "Expense" disguised as a settlement
        const settlementExpense = {
            description: "Debt Settlement 🤝",
            amount: parseFloat(settleAmount),
            paidBy: { id: parseInt(settlePayerId) },          // The one paying the debt
            participants: [{ id: parseInt(settleReceiverId) }] // The one receiving the money
        };

        fetch('http://localhost:8080/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settlementExpense),
        })
            .then(res => res.json())
            .then(data => {
                setExpenses([...expenses, data]);
                setSettlePayerId('');
                setSettleReceiverId('');
                setSettleAmount('');
                fetchBalances(); // This will magically zero out the debts!
            });
    };

    // --- UI RENDER ---
    return (
        <div className="App">
            <header className="App-header">
                <h1>SmartSplit</h1>

                {/* --- USERS --- */}
                <h2>Users</h2>
                <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={btnStyle}>Add</button>
                </form>

                <ul style={listStyle}>
                    {users.map(u => (
                        <li key={u.id} style={listItemStyle}>
                            <strong>{u.name}</strong> - {u.email}
                        </li>
                    ))}
                </ul>

                {/* --- EXPENSES --- */}
                <h2 style={{ marginTop: '40px' }}>Expenses</h2>
                <form onSubmit={handleAddExpense} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={inputStyle} />
                        <input type="number" step="0.01" placeholder="Amount (€)" value={amount} onChange={e => setAmount(e.target.value)} required style={inputStyle} />
                        <select value={payerId} onChange={handlePayerChange} required style={inputStyle}>
                            <option value="" disabled>Who Paid?</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>

                    <div style={{ backgroundColor: '#282c34', padding: '10px', borderRadius: '8px', border: '1px solid #555', width: '100%', maxWidth: '400px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#61dafb' }}>Who shares this?</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                            {users.map(u => (
                                <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={selectedParticipants.includes(u.id)} onChange={() => handleCheckboxChange(u.id)} />
                                    {u.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <button type="submit" style={{...btnStyle, marginTop: '10px'}}>Add Expense</button>
                </form>

                {/* --- NEW: SETTLE UP SECTION --- */}
                <h2 style={{ marginTop: '40px', color: '#4caf50' }}>Settle Up</h2>
                <form onSubmit={handleSettleUp} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <select value={settlePayerId} onChange={e => setSettlePayerId(e.target.value)} required style={inputStyle}>
                        <option value="" disabled>From (Who pays?)</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>➡️</span>
                    <select value={settleReceiverId} onChange={e => setSettleReceiverId(e.target.value)} required style={inputStyle}>
                        <option value="" disabled>To (Who receives?)</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <input type="number" step="0.01" placeholder="Amount (€)" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={{...btnStyle, backgroundColor: '#4caf50', color: 'white'}}>Settle</button>
                </form>

                <ul style={listStyle}>
                    {expenses.map(exp => (
                        <li key={exp.id} style={{ ...listItemStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{exp.description}</strong> - €{exp.amount} <br/>
                                <small style={{ color: '#aaa' }}>Paid by: {exp.paidBy?.name}</small><br/>
                                <small style={{ color: '#888' }}>
                                    Shared with: {exp.participants?.map(p => p.name).join(', ') || 'None'}
                                </small>
                            </div>
                            <button onClick={() => handleDeleteExpense(exp.id)} style={deleteBtnStyle}>X</button>
                        </li>
                    ))}
                </ul>

                {/* --- SETTLEMENTS --- */}
                <h2 style={{ marginTop: '40px', color: '#ffeb3b' }}>Balances</h2>
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