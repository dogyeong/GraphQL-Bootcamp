// Demo user data
let users = [
  { id: '1', name: 'Andrew', email: 'andrew@example.com', age: 27 },
  { id: '2', name: 'Sarah', email: 'sarah@example.com' },
  { id: '3', name: 'Mike', email: 'mike@example.com' },
];

let posts = [
  { id: '11', title: 'GraphQL 101', body: 'hi World!', published: false, author: '1' },
  { id: '12', title: 'GraphQL 102', body: 'hello!', published: true, author: '3' },
];

let comments = [
  { id: '21', text: 'Comment 1', author: '1', post: '12' },
  { id: '22', text: 'Comment 2', author: '3', post: '11' },
  { id: '23', text: 'Comment 3', author: '2', post: '12' },
  { id: '24', text: 'Comment 4', author: '1', post: '11' },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
