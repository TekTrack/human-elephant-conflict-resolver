

const login = async (username, password) => {
  const res = await fetch('http://localhost:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  // Save the token to local storage!
  localStorage.setItem('authToken', data.token); 
};

const fetchSecureData = async () => {
  const token = localStorage.getItem('authToken'); // Grab the saved token

  const res = await fetch('http://localhost:8080/api/admin/protected-route', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // 👈 The magic key!
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();
  console.log(data);
};

const logout = () => {
  localStorage.removeItem('authToken'); // Delete the key
  window.location.href = '/login'; // Redirect to login page
};

export default { login, fetchSecureData, logout };