import { getUserId } from '../utils/getUserId';

const User = {
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: { published: true, author: { id: parent.id } },
      });
    },
  },

  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { req }, info) {
      const userId = getUserId(req, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    },
  },
};

export default User;
