import Query from './Query';
import Mutation from './Mutation';
import Post from './Post';
import User from './User';
import Comment from './Comment';
import Subscription from './Subscription';
import { extractFragmentReplacements } from 'prisma-binding';

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Post,
  User,
  Comment,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
