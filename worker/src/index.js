'use strict';

const express = require('express');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();

// Health check endpoint cho ALB Target Group
app.get('/api/products/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'worker-product' });
});

// Endpoint dữ liệu nghiệp vụ giả lập
app.get('/api/products', (req, res) => {
    res.json({ message: "Hello from Worker Service!", timestamp: new Date() });
});

app.listen(PORT, HOST, () => {
    console.log(`Worker service running on http://${HOST}:${PORT}`);
});