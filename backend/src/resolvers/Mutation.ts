import { PubSub } from "graphql-subscriptions";
import AWS from "aws-sdk";

// Configure AWS SDK
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const pubSub = new PubSub();
const TODO_CREATED = "TODO_CREATED";
const TODO_UPDATED = "TODO_UPDATED";
const TODO_DELETED = "TODO_DELETED";

// DynamoDB Table Name
const TODOS_TABLE = "Todos";  // Change this based on your DynamoDB table name

export const Mutation = {
    // Create a new todo
    createTodo: async (_: any, { title, description }: { title: string; description: string }) => {
        const newTodo = {
            id: Date.now().toString(),  // Generate a unique ID
            title,
            description,
            completed: false,
        };

        // Insert into DynamoDB
        const params = {
            TableName: TODOS_TABLE,
            Item: newTodo,
        };

        try {
            await dynamoDb.put(params).promise();  // Insert the new todo
            pubSub.publish(TODO_CREATED, { todoCreated: newTodo });
            return newTodo;
        } catch (error) {
            console.error("Error creating todo", error);
            throw new Error("Could not create todo");
        }
    },

    // Update a todo
    updateTodo: async (_: any, { id, title, description, completed }: { id: string, title?: string, description?: string, completed?: boolean }) => {
        const todoParams = {
            TableName: TODOS_TABLE,
            Key: { id },
            UpdateExpression: "set #title = :title, #description = :description, completed = :completed",
            ExpressionAttributeNames: {
                "#title": "title",
                "#description": "description",
            },
            ExpressionAttributeValues: {
                ":title": title ?? null,
                ":description": description ?? null,
                ":completed": completed ?? null,
            },
            ReturnValues: "ALL_NEW",  // Return the updated item
        };

        try {
            const result = await dynamoDb.update(todoParams).promise();
            const updatedTodo = result.Attributes;
            pubSub.publish(TODO_UPDATED, { todoUpdated: updatedTodo });
            return updatedTodo;
        } catch (error) {
            console.error("Error updating todo", error);
            throw new Error("Could not update todo");
        }
    },

    // Delete a todo
    deleteTodo: async (_: any, { id }: { id: string }) => {
        const params = {
            TableName: TODOS_TABLE,
            Key: { id },
        };

        try {
            await dynamoDb.delete(params).promise();  // Delete the todo
            pubSub.publish(TODO_DELETED, { todoDeleted: id });
            return true;
        } catch (error) {
            console.error("Error deleting todo", error);
            throw new Error("Could not delete todo");
        }
    },
};

// Export PubSub and constants for subscriptions
export { pubSub, TODO_CREATED, TODO_UPDATED, TODO_DELETED };
