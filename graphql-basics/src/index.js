import { GraphQLServer } from 'graphql-yoga';

// 스칼라 타입의 종류 : String, Boolean, Int, Float, ID

// Demo user data
const users = [
  { id: '1', name: 'Andrew', email: 'andrew@example.com', age: 27 },
  { id: '2', name: 'Sarah', email: 'sarah@example.com' },
  { id: '3', name: 'Mike', email: 'mike@example.com' },
];

const posts = [
  { id: '1', title: 'GraphQL 101', body: 'hi World!', published: false, author: '1' },
  { id: '2', title: 'GraphQL 102', body: 'hello!', published: true, author: '3' },
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
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
    me() {
      return {
        id: '12345',
        name: 'Mike',
        emai: 'mike@example.com',
        age: 30,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
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
