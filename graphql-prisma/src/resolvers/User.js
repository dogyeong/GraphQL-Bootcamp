import { getUserId } from '../utils/getUserId';

const User = {
  email(parent, args, { req }, info) {
    const userId = getUserId(req, false);

    if (userId && userId === parent.id) {
      return parent.email;
    }
    return null;
  },
};

export default User;
