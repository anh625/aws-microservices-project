'use strict';

const express = require('express');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const SERVICE_URL = process.env.SERVICE_URL || "http://worker:3001"; 

const app = express();

// 1. Health check endpoint cho ALB Target Group
app.get('/api/auth/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'gateway-auth' });
});

// 2. Root route
app.get("/", (req, res) => {
    res.send('Gateway Auth Service is running!\n');
});

// 3. Forward request sang worker
app.get("/api/data", async (req, res) => {
    try {
        const response = await axios.get(`${SERVICE_URL}/api/products`, { timeout: 3000 });
        res.json(response.data);
    } catch (error) {
        res.status(502).json({ 
            error: "Backend Worker unavailable", 
            details: error.message 
        });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Gateway service running on http://${HOST}:${PORT}`);
});
// Trigger CI/CD test