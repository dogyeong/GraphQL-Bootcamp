const User = {
  posts(parent, args, { db: { users, posts, comments } }, info) {
    return posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db: { users, posts, comments } }, info) {
    return comments.filter((comment) => comment.author === parent.id);
  },
};

export default User;
