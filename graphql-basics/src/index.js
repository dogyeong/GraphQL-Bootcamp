import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// 스칼라 타입의 종류 : String, Boolean, Int, Float, ID

// Demo user data
const users = [
  { id: '1', name: 'Andrew', email: 'andrew@example.com', age: 27 },
  { id: '2', name: 'Sarah', email: 'sarah@example.com' },
  { id: '3', name: 'Mike', email: 'mike@example.com' },
];

const posts = [
  { id: '11', title: 'GraphQL 101', body: 'hi World!', published: false, author: '1' },
  { id: '12', title: 'GraphQL 102', body: 'hello!', published: true, author: '3' },
];

const comments = [
  { id: '21', text: 'Comment 1', author: '1', post: '12' },
  { id: '22', text: 'Comment 2', author: '3', post: '11' },
  { id: '23', text: 'Comment 3', author: '2', post: '12' },
  { id: '24', text: 'Comment 4', author: '1', post: '11' },
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    posts(parent, args, ctx, info) {
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
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email);

      if (emailTaken) {
        throw new Error('email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args,
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args,
      };

      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const postExists = posts.some((post) => post.id === args.post && post.published);
      const userExists = users.some((user) => user.id === args.author);

      if (!postExists || !userExists) {
        throw new Error('User or Post not found');
      }

      const comment = {
        id: uuidv4(),
        ...args,
      };

      comments.push(comment);
      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, cts, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('server is up');
});
