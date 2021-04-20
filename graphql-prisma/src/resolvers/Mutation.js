const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: data.email });

    if (emailTaken) {
      throw new Error('Email taken');
    }

    return prisma.mutation.createUser({ data }, info);
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
