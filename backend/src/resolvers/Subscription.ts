import {TODO_CREATED, TODO_UPDATED, TODO_DELETED } from "./Mutation";
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
export const Subscription = {
    todoCreated: {
        subscribe: () => pubSub.asyncIterableIterator([TODO_CREATED]),
    },
    todoUpdated: {
        subscribe: () => pubSub.asyncIterableIterator([TODO_UPDATED]),
    },
    todoDeleted: {
        subscribe: () => pubSub.asyncIterableIterator([TODO_DELETED]),
    }
};
