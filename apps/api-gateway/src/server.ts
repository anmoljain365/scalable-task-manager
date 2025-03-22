import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const app = express();

app.use('/user', createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true }));
app.use('/task', createProxyMiddleware({ target: 'http://localhost:4002', changeOrigin: true }));
app.use('/notification', createProxyMiddleware({ target: 'http://localhost:4003', changeOrigin: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
