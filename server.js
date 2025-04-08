const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'YOUR-API-KEY-HERE';

app.use(cors());

app.use(express.static(__dirname));

app.get('/api/vehicle-lookup', async (req, res) => {
  const { vrm } = req.query;
  
  if (!vrm) {
    return res.status(400).json({ error: 'Registration number is required' });
  }

  try {
    const apiUrl = `https://v2.api.ukvehicledata.co.uk/r2/lookup?packagename=VehicleData&apikey=${API_KEY}&vrm=${vrm}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Vehicle not found' });
    }
    
    const data = await response.json();
    console.log('Vehicle Lookup API Response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle data' });
  }
});

app.get('/api/vehicle-images', async (req, res) => {
  const { vrm } = req.query;
  
  if (!vrm) {
    return res.status(400).json({ error: 'Registration number is required' });
  }

  try {
    const apiUrl = `https://v2.api.ukvehicledata.co.uk/r2/lookup?packagename=VehicleImages&apikey=${API_KEY}&vrm=${vrm}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Vehicle images not found' });
    }
    
    const data = await response.json();
    console.log('Vehicle Images API Response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error fetching vehicle images:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle images' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 