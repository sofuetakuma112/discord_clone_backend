import boom from 'boom';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { userModel } from '../models/User';

export const getSingleUser = async (req) => {
  const id = req.params === undefined ? req.id : req.params.id;
  const user = await userModel.findById(id);
  return user;
};

export const getAllUsers = async () => {
  const users = await userModel.find();
  return users;
};

export const getUsers = async (req) => {
  const ids = req.params === undefined ? req.ids : req.params.ids;
  const users = await userModel.find({
    _id: { $in: ids },
  });
  return users;
};

export const authenticateSingleUser = async (req) => {
  try {
    const request = req.body === undefined ? req : req.body;
    const user: any = await userModel.find({
      email: request.email,
    });

    if (
      user.length !== 0 &&
      bcrypt.compareSync(request.password, user[0].password)
    ) {
      // rememberTokenはdbに保存
      const rememberToken = crypto.randomBytes(20).toString('hex');
      // ハッシュを作成（公開鍵のようなもの？）
      const hash = crypto
        .createHmac('sha256', process.env.APP_KEY as string)
        .update(user[0]._id + '-' + rememberToken)
        .digest('hex');

      // トークンをDBに保存
      await userModel.updateOne(
        {
          email: request.email,
        },
        { $set: { rememberToken } }
      );

      const tokenAndHash = rememberToken + '|' + hash;

      return {
        _id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        imageConvertedToBase64: user[0].imageConvertedToBase64,
        tokenAndHash,
        is_anonymous: user[0].is_anonymous,
        status: 1,
        socket_id: '',
      };
    }
    return {
      errorMessage: 'メールアドレスまたはパスワードが違います',
      status: 2,
    };
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const createNewUser = async (req) => {
  try {
    const request = req.body === undefined ? req : req.body;

    if (request.is_anonymous) {
      const user = new userModel({
        name: request.name,
        socket_id: request.socket_id,
        is_anonymous: true,
      });
      const newAnonymosUser = user.save();
      return newAnonymosUser;
    }

    const userData: any = await userModel.find({
      email: request.email,
    });
    if (userData.length !== 0)
      return {
        errorMessage: 'このメールアドレスはすでに使用されています',
        status: 2,
      };

    const rememberToken = crypto.randomBytes(20).toString('hex');
    const hashed = {
      ...request,
      rememberToken,
      password: bcrypt.hashSync(request.password, 10),
      is_anonymous: false,
    };
    const user = new userModel(hashed);
    const newUser: any = await user.save();

    // ハッシュを作成（公開鍵のようなもの？）
    const hash = crypto
      .createHmac('sha256', process.env.APP_KEY as string)
      .update(newUser._id + '-' + rememberToken)
      .digest('hex');
    const tokenAndHash = rememberToken + '|' + hash;

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      tokenAndHash,
      status: 1,
      socket_id: '',
      is_anonymous: newUser.is_anonymous,
      imageConvertedToBase64: newUser.imageConvertedToBase64,
    };
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const createAnonymousUser = (req) => {
  const request = req.body === undefined ? req : req.body;
  const user = new userModel({
    name: request.anonymousName,
    socket_id: request.socketId,
    is_anonymous: true,
  });
  const newAnonymosUser = user.save();
  return newAnonymosUser;
};

export const deleteAnonymousUser = async (id) => {
  const result = await userModel.remove({ socket_id: id, is_anonymous: true });
  return result;
};
