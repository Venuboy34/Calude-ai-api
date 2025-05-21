// index.js - Main API file for Vercel deployment
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API route to proxy requests to claude3.gptnb.xyz
app.post('/api/chat', async (req, res) => {
  try {
    const { message, options } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Make request to the target website
    const response = await axios.post('https://claude3.gptnb.xyz/api/chat', {
      message,
      options: options || {} // Pass any additional options
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Return the response from the target website
    return res.json(response.data);
  } catch (error) {
    console.error('Error calling Claude API:', error.message);
    return res.status(500).json({ 
      error: 'Failed to get response', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Claude API is running' });
});

// For local development
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app;
