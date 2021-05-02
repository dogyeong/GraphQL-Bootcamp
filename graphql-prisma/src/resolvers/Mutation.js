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

  async deletePost(parent, { id }, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({ id, author: { id: userId } });

    if (!postExists) throw new Error('Unable to delete post');

    return prisma.mutation.deletePost({ where: { id } }, info);
  },

  async updatePost(parent, { id, data }, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({ id, author: { id: userId } });
    const isPublished = await prisma.exists.Post({ id, published: true });

    if (!postExists) throw new Error('Unable to update post');

    if (isPublished && data.published === false) {
      await prisma.mutation.deleteManyComments({ where: { post: { id } } });
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },

  async createComment(parent, { data: { text, post } }, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await await prisma.exists.Post({ id: post, published: true });

    if (!postExists) throw new Error('Unable to find  post');

    return prisma.mutation.createComment(
      {
        text,
        author: { connect: { id: userId } },
        post: { connect: { id: post } },
      },
      info,
    );
  },

  async deleteComment(parent, { id }, { prisma, req }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({ id, author: { id: userId } });

    if (!commentExists) throw new Error('Unable to delete comment');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },

  async updateComment(parent, { id, data }, { prisma, req }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({ id, author: { id: userId } });

    if (!commentExists) throw new Error('Unable to update comment');

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
};

export default Mutation;
