// importしているfastifyはrequire('fastify')({ logger: true })
import fastify from './server';
import routes from './routes/index';
import qql from 'fastify-gql';
import { schema } from './schema/index';
require('dotenv').config();
import crypto from 'crypto';
import { userModel } from './models/User';

// Fastify インスタンスに機能を追加する必要がある場合、必要なのは decorate API です。
// API を使うと、Fastify インスタンスに新しいプロパティを追加することができます
// decorate を呼び出して、アプリに認証ハンドラを追加します。
// done は、次のミドルウェアを呼び出すために呼び出す関数です。
// 非同期で呼び出したらdoneしなくても良い
fastify
  .decorate('asyncVerifyToken', async function (request, reply) {
    const [rememberToken, hash] = request.body.tokenAndHash.split('|');

    await userModel
      .find({
        rememberToken,
      })
      .then(async (users: any) => {
        for (const user of users) {
          const verifyingHash = crypto
            .createHmac('sha256', process.env.APP_KEY as string)
            .update(user._id + '-' + rememberToken)
            .digest('hex');
          if (hash === verifyingHash) {
            // ここでトークンを再度生成するべき
            const rememberToken = crypto.randomBytes(20).toString('hex');
            const hash = crypto
              .createHmac('sha256', process.env.APP_KEY as string)
              .update(user._id + '-' + rememberToken)
              .digest('hex');
            const tokenAndHash = rememberToken + '|' + hash;

            await userModel.updateOne(
              {
                email: user.email,
              },
              { $set: { rememberToken } }
            );
            reply.send({
              _id: user._id,
              name: user.name,
              email: user.email,
              imageConvertedToBase64: user.imageConvertedToBase64,
              tokenAndHash,
              is_anonymous: user.is_anonymous,
              status: 1,
              socket_id: '',
            });
          } else {
            // 不正なトークンでアクセスしている
            reply.send({ status: 2, message: '不正なトークンです' });
          }
        }
        reply.send({ status: 2, message: 'tokenの期限が切れています' });
      });
  })
  .register(require('fastify-auth'))
  .after(() => {
    fastify.route({
      method: 'POST',
      url: '/auth',
      preHandler: fastify.auth([fastify.asyncVerifyToken]),
      handler: (req, reply) => {
        req.log.info('Auth route');
        reply.send({ hello: 'world' });
      },
    });
  });

declare module 'fastify' {
  interface FastifyInstance {
    basicAuth: any;
    auth: any;
    asyncVerifyToken: any;
    asyncVerifyUserAndPassword: any;
  }
}

// validateはユーザ名とパスワードを検証する関数です。
// authenticate はレルムを設定するためのオブジェクトです。
const authenticate = { realm: 'Westeros' };
fastify.register(require('fastify-basic-auth'), { validate, authenticate });

// validate が非同期であれば、 done を呼び出す必要はありません。
async function validate(username, password, req, reply) {
  console.log('\n', username, password, req, reply, '\n');
  if (username !== 'foo' || password !== 'bar') {
    return new Error('invalid user');
  }
}

// Fastify GraphQLアダプタが必要なので、
// スキーマをインポートし、FastifyにGraphQLアダプタを登録します。
fastify.register(qql, {
  schema,
  graphiql: true,
  // subscription: true
});

fastify.after(() => {
  routes(fastify).forEach((route, index) => {
    fastify.route(route);
  });
});

fastify.ready((err) => {
  if (err) throw err;
  console.log('server started');
});

const PORT: any = process.env.PORT || 5000;
const ADDRESS = process.env.ADDRESS || '0.0.0.0';

const start = async () => {
  try {
    await fastify.listen(PORT, ADDRESS);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
