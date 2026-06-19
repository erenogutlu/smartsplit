import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // --- MY AUTHENTICATION STATES ---
    // I check local storage first so my users stay logged in even if they refresh the page.
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // I use this to toggle the lobby UI between 'Login' and 'Register'
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [authName, setAuthName] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');

    // --- MY APP DATA STATES ---
    const [users, setUsers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState('');
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [balances, setBalances] = useState({});
    const [myDashboard, setMyDashboard] = useState(null);

    // States for the 'Settle Up' feature
    const [settlePayerId, setSettlePayerId] = useState('');
    const [settleReceiverId, setSettleReceiverId] = useState('');
    const [settleAmount, setSettleAmount] = useState('');

    // --- MY SECURITY HELPERS ---
    // This is my magic function. I attach the JWT token to every request
    // so my Spring Boot security filter chain lets me in.
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // I only fetch the sensitive data if I have successfully authenticated the user.
    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
            fetchExpenses();
            fetchBalances();
            fetchMyDashboard();
        }
    }, [isAuthenticated, token]);

    // --- API FETCH FUNCTIONS ---
    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users', { headers: getHeaders() })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error fetching users:", err));
    };

    const fetchExpenses = () => {
        fetch('http://localhost:8080/api/expenses', { headers: getHeaders() })
            .then(res => res.json())
            .then(data => setExpenses(data))
            .catch(err => console.error("Error fetching expenses:", err));
    };

    const fetchBalances = () => {
        fetch('http://localhost:8080/api/expenses/balances', { headers: getHeaders() })
            .then(res => res.json())
            .then(data => setBalances(data))
            .catch(err => console.error("Error fetching balances:", err));
    };

    const fetchMyDashboard = () => {
        fetch('http://localhost:8080/api/expenses/my-dashboard', { headers: getHeaders() })
            .then(res => res.json())
            .then(data => setMyDashboard(data))
            .catch(err => console.error("Error fetching dashboard:", err));
    };

    // --- AUTHENTICATION HANDLERS ---
    // I combined login and register into one smart function to keep my code DRY.
    const handleAuth = (e) => {
        e.preventDefault();
        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
        const payload = isLoginMode
            ? { email: authEmail, password: authPassword }
            : { name: authName, email: authEmail, password: authPassword };

        fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(async res => {
                if (!res.ok) throw new Error("Authentication failed!");
                // Register returns a simple string, while Login returns my JWT JSON object.
                return isLoginMode ? res.json() : res.text();
            })
            .then(data => {
                if (isLoginMode) {
                    // Login successful: I save the token to the browser's wallet (LocalStorage).
                    setToken(data.token);
                    setIsAuthenticated(true);
                    localStorage.setItem('token', data.token);
                } else {
                    alert("Registration successful! You can now log in.");
                    setIsLoginMode(true);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Error! Please check your credentials.");
            });
    };

    // I clear the states and destroy the token from local storage to lock the app.
    const handleLogout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    // --- EXPENSE LOGIC HANDLERS ---
    const handleCheckboxChange = (userId) => {
        setSelectedParticipants(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    // My Smart Default UX feature: When a payer is selected, I automatically add them
    // to the participants list, assuming they also ate/used what they paid for.
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
        if (selectedParticipants.length === 0) return alert("Please select at least one participant!");

        // I format the payload exactly how my Spring Data JPA @ManyToMany relationship expects it.
        const newExpense = {
            description, amount: parseFloat(amount),
            paidBy: { id: parseInt(payerId) },
            participants: selectedParticipants.map(id => ({ id: id }))
        };

        fetch('http://localhost:8080/api/expenses', {
            method: 'POST',
            headers: getHeaders(), // Injecting the VIP card!
            body: JSON.stringify(newExpense),
        }).then(() => {
            setDescription('');
            setAmount('');
            setPayerId('');
            setSelectedParticipants([]);
            fetchExpenses();
            fetchBalances();
            fetchMyDashboard();
        });
    };

    // I created a disguised expense here. A settlement is just an expense paid by the debtor,
    // exclusively shared with the creditor. My backend algorithm handles the rest magically.
    const handleSettleUp = (e) => {
        e.preventDefault();
        if (settlePayerId === settleReceiverId) return alert("You cannot settle up with yourself!");

        const settlementExpense = {
            description: "Debt Settlement 🤝", amount: parseFloat(settleAmount),
            paidBy: { id: parseInt(settlePayerId) },
            participants: [{ id: parseInt(settleReceiverId) }]
        };

        fetch('http://localhost:8080/api/expenses', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(settlementExpense),
        }).then(() => {
            setSettlePayerId('');
            setSettleReceiverId('');
            setSettleAmount('');
            fetchExpenses();
            fetchBalances();
            fetchMyDashboard();
        });
    };

    const handleDeleteExpense = (id) => {
        fetch(`http://localhost:8080/api/expenses/${id}`, {
            method: 'DELETE', headers: getHeaders(),
        }).then(() => {
            fetchExpenses();
            fetchBalances();
            fetchMyDashboard();
        });
    };

    // ==========================================
    // SCREEN 1: THE LOBBY (Public Area)
    // I block the entire app UI if the user is not authenticated.
    // ==========================================
    if (!isAuthenticated) {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>SmartSplit Security 🔒</h1>
                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', backgroundColor: '#282c34', padding: '30px', borderRadius: '10px', border: '1px solid #555' }}>
                        <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
                        {!isLoginMode && (
                            <input type="text" placeholder="Name" value={authName} onChange={e => setAuthName(e.target.value)} required style={inputStyle} />
                        )}
                        <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required style={inputStyle} />
                        <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required style={inputStyle} />
                        <button type="submit" style={btnStyle}>{isLoginMode ? 'Login' : 'Register'}</button>
                    </form>
                    <p style={{ marginTop: '20px', cursor: 'pointer', color: '#61dafb', textDecoration: 'underline' }} onClick={() => setIsLoginMode(!isLoginMode)}>
                        {isLoginMode ? "Don't have an account? Register." : "Already have an account? Login."}
                    </p>
                </header>
            </div>
        );
    }

    // ==========================================
    // SCREEN 2: THE VIP AREA (Secured App)
    // Only visible when the user holds a valid JWT token.
    // ==========================================
    return (
        <div className="App">
            <header className="App-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', alignItems: 'center' }}>
                    <h1>SmartSplit</h1>
                    <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: '#f44336', color: 'white' }}>Logout 🚪</button>
                </div>

                {/* --- MY DASHBOARD SECTION --- */}
                {myDashboard && (
                    <div style={{ backgroundColor: '#20232a', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '400px', margin: '20px 0', border: '2px solid #61dafb', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#fff' }}>Hello, {myDashboard.name} 👋</h2>
                        <p style={{ fontSize: '16px', margin: '0', color: '#aaa' }}>Your Current Balance:</p>
                        <h1 style={{
                            margin: '10px 0 0 0',
                            fontSize: '32px',
                            color: myDashboard.balance > 0 ? '#4caf50' : myDashboard.balance < 0 ? '#f44336' : '#9e9e9e'
                        }}>
                            {myDashboard.balance > 0
                                ? `+€${myDashboard.balance} (Gets)`
                                : myDashboard.balance < 0
                                    ? `-€${Math.abs(myDashboard.balance)} (Owes)`
                                    : '€0 (Settled)'}
                        </h1>
                    </div>
                )}

                {/* --- EXPENSES SECTION --- */}
                <h2 style={{ marginTop: '20px' }}>Add Expense</h2>
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

                {/* --- SETTLE UP SECTION --- */}
                <h2 style={{ marginTop: '20px', color: '#4caf50' }}>Settle Up</h2>
                <form onSubmit={handleSettleUp} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <select value={settlePayerId} onChange={e => setSettlePayerId(e.target.value)} required style={inputStyle}>
                        <option value="" disabled>From</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>➡️</span>
                    <select value={settleReceiverId} onChange={e => setSettleReceiverId(e.target.value)} required style={inputStyle}>
                        <option value="" disabled>To</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <input type="number" step="0.01" placeholder="Amount (€)" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={{...btnStyle, backgroundColor: '#4caf50', color: 'white'}}>Settle</button>
                </form>

                {/* --- EXPENSE LIST --- */}
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

                {/* --- SETTLEMENTS (BALANCES) --- */}
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

// UI Styles
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#61dafb', border: 'none', fontWeight: 'bold', color: '#282c34' };
const deleteBtnStyle = { backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' };
const listStyle = { listStyleType: 'none', padding: 0, width: '100%', maxWidth: '500px', textAlign: 'left', margin: '0 auto' };
const listItemStyle = { margin: '10px 0', borderBottom: '1px solid #555', paddingBottom: '10px' };

export default App;