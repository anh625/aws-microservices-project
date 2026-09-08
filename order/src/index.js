'use strict';

const express = require('express');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(express.json());

// Khởi tạo Connection Pool tới Amazon RDS MySQL
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'microservices_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    connectTimeout: 5000,
    ssl: {
        rejectUnauthorized: false
    }
});

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

// 3. Endpoint kiểm thử kết nối MySQL
app.get('/api/orders/db-test', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT 1 + 1 AS solution, NOW() AS currentTime');
        res.json({
            database_status: "Connected successfully to RDS MySQL!",
            query_result: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            database_status: "Connection failed",
            error_code: error.code,
            details: error.message
        });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Order service running on http://${HOST}:${PORT}`);
});