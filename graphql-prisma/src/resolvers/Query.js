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
  me() {
    return {
      id: '3',
      name: 'Mike',
      emai: 'mike@example.com',
      age: 30,
    };
  },
};

export default Query;
