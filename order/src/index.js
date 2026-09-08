'use strict';

const express = require('express');

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(express.json());

// 1. Health check endpoint cho ALB Target Group
app.get('/api/orders/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'order-service' });
});

// 2. API nghiệp vụ Order giả lập
app.get('/api/orders', (req, res) => {
    res.json({
        message: "Order Service is operational",
        orders: [
            { id: "ORD-001", item: "AWS Cloud Course", total: 91.0 },
            { id: "ORD-002", item: "Microservices Book", total: 41.0 }
        ]
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Order service running on http://${HOST}:${PORT}`);
});