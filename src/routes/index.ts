import * as categoryController from '../controllers/categoryController';
import * as channelController from '../controllers/channelController';
import * as chatController from '../controllers/chatController';
import * as userController from '../controllers/userController';

const routes = (fastify) => {
  return [
    {
      method: 'GET' as 'GET',
      url: '/',
      handler: (req, reply) => reply.send({ hello: 'world' }),
    },
    {
      method: 'POST' as 'POST',
      url: '/api/register',
      handler: userController.createNewUser,
    },
    {
      method: 'POST' as 'POST',
      url: '/api/login',
      handler: userController.authenticateSingleUser,
    },
    {
      method: 'POST' as 'POST',
      url: '/api/anonymousLogin',
      handler: userController.createAnonymousUser,
    },
    {
      method: 'GET' as 'GET',
      url: '/api/category',
      onRequest: fastify.basicAuth,
      handler: categoryController.getAllCategory,
    },
    {
      method: 'GET' as 'GET',
      url: '/api/category/:id',
      handler: categoryController.getSingleCategory,
    },
    {
      method: 'POST' as 'POST',
      url: '/api/category',
      handler: categoryController.createNewCategory,
      // schema: categorySchema as FastifySchema,
    },
    {
      method: 'GET' as 'GET',
      url: '/api/channel/:id',
      handler: channelController.getChannelsCategory,
    },
    {
      method: 'POST' as 'POST',
      url: '/api/channel',
      handler: channelController.createNewChannel,
    },
    {
      method: 'GET' as 'GET',
      url: '/api/chat/:id',
      handler: chatController.getChatsParent,
    },
    {
      method: 'POST' as 'POST',
      url: '/api/chat',
      handler: chatController.addChat,
    },
  ];
};

export default routes;
