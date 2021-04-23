import bcrypt from 'bcryptjs';

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer');
    }

    const password = await bcrypt.hash(data.password, 10);

    return prisma.mutation.createUser({ data: { ...data, password } }, info);
  },

  async deleteUser(parent, { id }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id });

    if (!userExists) {
      throw new Error('User not found');
    }

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },

  async updateUser(parent, { id, data }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id });

    if (!userExists) {
      throw new Error('User not found');
    }

    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },

  createPost(parent, { data: { title, body, published, author } }, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: { connect: { id: author } },
        },
      },
      info,
    );
  },

  deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id } }, info);
  },

  updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({ where: { id }, data }, info);
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
