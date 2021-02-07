## 24. Creating Data with Mutations: Part I

데이터를 추가,수정,삭제할 때는 Query가 아니라 Mutation 오퍼레이션을 사용해야 한다.

그러기 위해서 먼저 typeDef에서 Mutation 타입을 지정하고 그 안에 필요한 쿼리를 추가한다.

```javascript
const typeDefs = `
  type Query{
    ...
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }
`;
```

그리고 추가한 쿼리를 처리하는 resolver를 정의한다.

```javascript
const resolvers = {
  Query: {
    // ...
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email);

      if (emailTaken) {
        throw new Error('email taken.');
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      users.push(user);
      return user;
    },
  },
};
```

## 27. The Input Type

Mutation을 만들다 보면 입력 파라미터로 많은 종류의 값이 들어오는 경우나, 동일한 파라미터들이 반복되는 경우가 있다.

이런 경우에는 input 타입을 만들어서 사용할 수 있다. input 타입은 type 객체처럼 만들어서 사용하면 되는데,

input 타입에는 커스텀 타입을 사용할 수 없고 기본 스칼라 타입, 리스트, 다른 input 타입만 사용할 수 있다.

```graphql
type Mutation {
  createUser(data: createUserInput): User!
}

input createUserInput {
  name: String!
  email: String!
  age: Int
}
```
