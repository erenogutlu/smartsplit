import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Gelen kullanıcıları tutacağımız boş liste (Müşterinin masadaki menüsü)
  const [users, setUsers] = useState([]);

  // Garsona (Backend) seslenip verileri getiren fonksiyon
  const fetchUsers = () => {
    fetch('http://localhost:8080/api/users')
        .then(response => response.json()) // Garsonun getirdiği JSON paketini aç
        .then(data => setUsers(data))      // İçindeki veriyi menümüze (users) yaz
        .catch(error => console.error("Sipariş alınamadı:", error));
  };

  // Sayfa ilk açıldığında otomatik olarak Garsonu çağırır
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          <h1>SmartSplit Kullanıcıları</h1>

          {/* Kullanıcı listesini ekrana basıyoruz */}
          <ul>
            {users.map(user => (
                <li key={user.id}>
                  {user.name} - {user.email}
                </li>
            ))}
          </ul>

        </header>
      </div>
  );
}

export default App;