import { getUserId } from '../utils/getUserId';

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }

    return prisma.query.users(null, info);
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }],
      };
    }

    return prisma.query.posts(null, info);
  },

  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, null);
  },

  me(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);

    return prisma.query.user({ where: { id: userId } });
  },

  async post(parent, { id }, { prisma, req }, info) {
    const userId = getUserId(req, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [{ published: true }, { author: { id: userId } }],
        },
      },
      info,
    );

    if (posts.length === 0) throw new Error('post not found');

    return posts[0];
  },
};

export default Query;
