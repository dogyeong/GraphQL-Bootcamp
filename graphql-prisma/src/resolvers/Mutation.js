import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: data.email });

    if (emailTaken) {
      throw new Error('Email taken');
    }

    return prisma.mutation.createUser({ data }, info);
  },

  async deleteUser(parent, { id }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id });

    if (!userExists) {
      throw new Error('User not found');
    }

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },

  async updateUser(parent, { id, data }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id });

    if (!userExists) {
      throw new Error('User not found');
    }

    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },

  createPost(parent, { data: { title, body, published, author } }, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: { connect: { id: author } },
        },
      },
      info,
    );
  },

  deletePost(parent, args, { db: { posts, comments }, pubsub }, info) {
    const postIndex = posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const [deletedPost] = posts.splice(postIndex, 1);

    comments = comments.filter((comment) => comment.post !== args.id);

    if (deletedPost.published) pubsub.publish('post', { post: { mutation: 'DELETED', data: deletedPost } });

    return deletedPost;
  },
  updatePost(parent, { id, data }, { db: { posts }, pubsub }, info) {
    const post = posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) throw new Error('Post not found');

    if (typeof data.title === 'string') post.title = data.title;

    if (typeof data.body === 'string') post.body = data.body;

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish('post', { post: { mutation: 'DELETED', data: post } });
      } else if (post.published) {
        pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
      }
    } else if (post.published) {
      pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
    }

    return post;
  },
  createComment(parent, { data }, { db: { users, posts, comments }, pubsub }, info) {
    const postExists = posts.some((post) => post.id === data.post && post.published);
    const userExists = users.some((user) => user.id === data.author);

    if (!postExists || !userExists) {
      throw new Error('User or Post not found');
    }

    const comment = {
      id: uuidv4(),
      ...data,
    };

    comments.push(comment);
    pubsub.publish(`comment ${data.post}`, { comment: { mutation: 'CREATED', data: comment } });

    return comment;
  },
  deleteComment(parent, args, { db: { comments }, pubsub }, info) {
    const commentIndex = comments.findIndex((comment) => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComment.post}`, { comment: { mutation: 'DELETED', data: deletedComment } });

    return deletedComment;
  },
  updateComment(parent, { id, data }, { db: { comments }, pubsub }, info) {
    const comment = comments.find((comment) => comment.id === id);

    if (!comment) throw new Error('Comment not found');

    if (typeof data.text === 'string') comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, { comment: { mutation: 'UPDATED', data: comment } });

    return comment;
  },
};

export default Mutation;
