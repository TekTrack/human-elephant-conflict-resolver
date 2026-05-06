//const BASE_URL = 'your_api_base_url'; // Ideally from an env variable

export const fetchDrones = async (
  setDrones: (data: any[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  try {
    setLoading(true);
    setError(null);
    const res = await fetch(`${BASE_URL}/drones`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      // Handle different possible API response structures
      setDrones(data.data || data || []);
    } else {
      setError("Failed to fetch drones data from server");
    }
  } catch (err) {
    console.error(err);
    setError("Network Error: Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
};