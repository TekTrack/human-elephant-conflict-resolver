import API_BASE_URL from '../config/url';

const login = async ( username: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/login`, 
      {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      alert("Invalid Credentials!");
      return false; // Tell the UI it failed
    }
    const data = await res.json();
    localStorage.setItem('authToken', data.token); 
    localStorage.setItem('username', username);
    return true; // Success!
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fetchSecureData = async () => {
  const token = localStorage.getItem('authToken'); // Grab the saved token
  //const username = localStorage.getItem('username'); // Grab the saved username
    const res = await fetch(`${API_BASE_URL}/api/admin/protected-route`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // 👈 The magic key!
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log(data);
  }
  
 
const logout = () => {
  localStorage.removeItem('authToken'); 
  localStorage.removeItem('username');
  window.location.href = '/';
};

export default { login, fetchSecureData, logout };