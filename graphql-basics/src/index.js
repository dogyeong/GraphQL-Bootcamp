import { GraphQLServer } from 'graphql-yoga';

// 스칼라 타입의 종류 : String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    me: User!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '12345',
        name: 'Mike',
        emai: 'mike@example.com',
        age: 30,
      };
    },
    add(_, args) {
      return args.numbers.reduce((acc, cur) => acc + cur, 0);
    },
    grades() {
      return [10, 20, 300];
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
