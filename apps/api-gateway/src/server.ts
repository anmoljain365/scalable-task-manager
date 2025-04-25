import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// For local
// app.use('/user', createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true }));
// app.use('/task', createProxyMiddleware({ target: 'http://localhost:4002', changeOrigin: true }));
// app.use('/notification', createProxyMiddleware({ target: 'http://localhost:4003', changeOrigin: true }));

// For Docker
app.use('/user', createProxyMiddleware({ target: 'http://user-service:4001', changeOrigin: true }));
app.use('/task', createProxyMiddleware({ target: 'http://task-service:4002', changeOrigin: true }));
app.use('/notification', createProxyMiddleware({ target: 'http://notification-service:4003', changeOrigin: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
