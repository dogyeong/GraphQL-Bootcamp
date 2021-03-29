const Post = {
  author(parent, args, { db: { users, posts, comments } }, info) {
    return users.find((user) => user.id === parent.author);
  },
  comments(parent, args, { db: { users, posts, comments } }, info) {
    return comments.filter((comment) => comment.post === parent.id);
  },
};

export default Post;
