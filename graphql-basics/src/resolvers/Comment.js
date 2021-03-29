const Comment = {
  author(parent, args, { db: { users, posts, comments } }, info) {
    return users.find((user) => user.id === parent.author);
  },
  post(parent, args, { db: { users, posts, comments } }, info) {
    return posts.find((post) => post.id === parent.post);
  },
};

export default Comment;
