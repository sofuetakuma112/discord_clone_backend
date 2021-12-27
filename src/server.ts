import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import mongoose from 'mongoose';
require('dotenv').config();

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true,
});

server.register(require('fastify-cors'), {
  origin: 'https://discord-clone-sofue.netlify.app/',
});

// DBサーバーの立ち上げ
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

export const io = require('socket.io')(server.server, {
  cors: {
    origin: '*',
  },
});

export default server;
