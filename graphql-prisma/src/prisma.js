import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error('User not found');
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: { ...data, author: { connect: { id: authorId } } },
//     },
//     '{ author { id email name posts { id title published } } }',
//   );

//   return post.author;
// };

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw new Error('Post not found');
//   }

//   const post = await prisma.mutation.updatePost(
//     {
//       where: { id: postId },
//       data,
//     },
//     '{ author { id email name posts { id title published } } }',
//   );

//   return post.author;
// };

// createPostForUser('cknd60bnd004t0a30y5ampnqa', {
//   title: 'BASE!',
//   body: '',
//   published: true,
// });

export default prisma;
