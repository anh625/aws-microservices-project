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

// 3. Endpoint dữ liệu nghiệp vụ giả lập
app.get("/api/auth", async (req, res) => {
    res.json({
        message: "gateway Service is operational",
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Gateway service running on http://${HOST}:${PORT}`);
});