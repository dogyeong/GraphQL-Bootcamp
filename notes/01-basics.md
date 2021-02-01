## 11. Creating Your Own GraphQL API

GraphQL 서버에서는 typeDefs, resolver가 필요하다.

typeDefs는 GraphQL 스키마를 정의하는 부분이고, resolver는 GraphQL 요청에 응답할 때 데이터를 반환하는 로직을 정의하는 함수이다.

```javascript
import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    hello: String! 
  }
`;

const resolvers = {
  Query: {
    hello() {
      return 'Wordl!';
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
```

## 12. GraphQL Scalar Types

GraphQL의 기본 스칼라 타입은 5가지가 있다.

- String
- Int
- Float
- Boolean
- ID

그리고 non-null 타입을 지정하려면 뒤에 느낌표`!`를 붙이면 된다

```javascript
const typeDefs = `
  type Query {
    name: String!
    age: Int
  }
`;
```

## 14. Creating Custom Types

커스텀 타입을 정의해서 사용할 수 있다

```javascript
const typeDefs = `
  type Query {
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;
```

## 15. Operation Arguments

쿼리할 때 argument를 전달할 수 있다.

GraphQL-yoga 라이브러리의 resolver 함수는 parent, args, ctx, info 네개의 인자를 받고, 요청의 operation arguments는 args에 담겨서 전달된다.

```javascript
const typeDefs = `
  type Query {
    greeting(name: String): String!
  }
`;

const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name) {
        return `Hello, ${args.name}!`;
      } else {
        return 'Hello!';
      }
    },
  },
};
```

위와 같이 서버를 세팅하면

```graphql
query {
  greeting(name: "John")
}
```

```json
{
  "data": {
    "greeting": "Hello, John!"
  }
}
```

위와 같이 요청/응답할 수 있다.
argument는 여러개 지정할 수도 있다.

## 16. Working with Arrays: Part I

대괄호`[]`를 이용해서 배열을 나타낼 수 있다

괄호 뒤에 느낌표를 붙이면 리턴 값이 non-null이라는 뜻이고, 괄호 안의 타입뒤에 느낌표를 붙이면 배열의 원소의 타입이 non-null이라는 뜻이다.

예시는 아래와 같다.

```javascript
// 스키마 선언 예시
const typeDefs = `
  Query {
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
  }
`;
```

```graphql
# 쿼리 예시
query {
  add(numbers: [10, 51.2])
}
```

## 17. Working with Arrays: Part II

스칼라타입을 엘리먼트로 가지는 배열과는 다르게 커스텀타입을 엘리먼트로 가지는 배열을 쿼리할 때는 원하는 필드를 명시해야 한다

```graphql
query {
  users {
    id
    name
    email
  }
}
```

```json
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Andrew",
        "email": "andrew@example.com"
      },
      {
        "id": "2",
        "name": "Sarah",
        "email": "sarah@example.com"
      },
      {
        "id": "3",
        "name": "Mike",
        "email": "mike@example.com"
      }
    ]
  }
}
```
