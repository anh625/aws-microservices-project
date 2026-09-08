'use strict';

const express = require('express');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(express.json());

// Cấu hình Connection Pool kết nối tới Amazon RDS MySQL
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
        rejectUnauthorized: false // Cho phép kết nối TLS tới chứng chỉ mặc định của Amazon RDS
    }
});

// 1. Health check endpoint cho ALB Target Group
app.get('/api/products/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'worker-product' });
});

// 2. Endpoint kiểm thử kết nối MySQL
app.get('/api/products/db-test', async (req, res) => {
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

// 3. Endpoint dữ liệu nghiệp vụ
app.get('/api/products', (req, res) => {
    res.json({ message: "Hello from Worker Service!", timestamp: new Date() });
});

app.listen(PORT, HOST, () => {
    console.log(`Worker service running on http://${HOST}:${PORT}`);
});