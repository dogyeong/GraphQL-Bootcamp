const Query = {
  users(parent, args, { prisma }, info) {
    return prisma.query.users(null, info);
  },
  posts(parent, args, { prisma }, info) {
    return prisma.query.posts(null, info);
  },
  comments(parent, args, { db: { comments } }, info) {
    return comments;
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
