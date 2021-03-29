const Query = {
  users(parent, args, { db: { users, posts, comments } }, info) {
    if (!args.query) {
      return users;
    }
    return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
  },
  posts(parent, args, { db: { users, posts, comments } }, info) {
    if (!args.query) {
      return posts;
    }
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    });
  },
  comments() {
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
