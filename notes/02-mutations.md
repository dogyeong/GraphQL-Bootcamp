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
