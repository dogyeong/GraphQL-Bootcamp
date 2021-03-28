import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

// 스칼라 타입의 종류 : String, Boolean, Int, Float, ID

// Resolvers
const resolvers = {
  Query: {
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
  },
  Mutation: {
    createUser(parent, args, { db: { users, posts, comments } }, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);
      return user;
    },
    deleteUser(parent, args, { db: { users, posts, comments } }, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const [deletedUser] = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUser;
    },
    createPost(parent, args, { db: { users, posts, comments } }, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);
      return post;
    },
    deletePost(parent, args, { db: { users, posts, comments } }, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, { db: { users, posts, comments } }, info) {
      const postExists = posts.some((post) => post.id === args.data.post && post.published);
      const userExists = users.some((user) => user.id === args.data.author);

      if (!postExists || !userExists) {
        throw new Error('User or Post not found');
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, { db: { users, posts, comments } }, info) {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id);

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComments = comment.splice(commentIndex, 1);

      return deletedComments[0];
    },
  },
  Post: {
    author(parent, args, { db: { users, posts, comments } }, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent, args, { db: { users, posts, comments } }, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent, args, { db: { users, posts, comments } }, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, { db: { users, posts, comments } }, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent, args, { db: { users, posts, comments } }, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, { db: { users, posts, comments } }, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
});

server.start(() => {
  console.log('server is up');
});
