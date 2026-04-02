export default function Users() {
    return (
        <div>
            <h3>1. Create New Admin 👤</h3>
            <input placeholder="New Username" onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} />
            <input type="password" placeholder="New Password" onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
            <button onClick={handleCreateAdmin}>Create</button>

            <hr />

            <h3>2. Verify Sighting ✅</h3>
            <input placeholder="Sighting ID (e.g., 1)" onChange={e => setSightingId(e.target.value)} />
            <button onClick={handleVerify}>Verify</button>

            <hr />
        </div>
    );
}