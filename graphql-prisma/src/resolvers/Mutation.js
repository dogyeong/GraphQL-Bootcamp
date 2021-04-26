import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserId } from '../utils/getUserId';

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer');
    }

    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.mutation.createUser({ data: { ...data, password } });

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret'),
    };
  },

  async login(parent, { data: { email, password } }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email } });

    if (!user) throw new Error('Unable to login');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error('Unable to login');

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret'),
    };
  },

  deleteUser(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  updateUser(parent, { data }, { prisma, req }, info) {
    const userId = getUserId(req);
    return prisma.mutation.updateUser({ where: { id: userId }, data }, info);
  },

  createPost(parent, { data: { title, body, published } }, { prisma, req }, info) {
    const userId = getUserId(req);

    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: { connect: { id: userId } },
        },
      },
      info,
    );
  },

  deletePost(parent, { id }, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = prisma.exists.Post({ where: { id, author: { id: userId } } });

    if (!postExists) throw new Error('Unable to delete post');

    return prisma.mutation.deletePost({ where: { id } }, info);
  },

  updatePost(parent, { data }, { prisma, req }, info) {
    const userId = getUserId(req);
    return prisma.mutation.updatePost({ where: { id: userId }, data }, info);
  },

  createComment(parent, { data: { text, author, post } }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        text,
        author: { connect: { id: author } },
        post: { connect: { id: post } },
      },
      info,
    );
  },

  deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  },

  updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
};

export default Mutation;
