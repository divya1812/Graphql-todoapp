// src/App.js
import React, { useState, useEffect } from 'react';
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import client from './apollo-client';
import { Button, TextField, Box, Typography, List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// GraphQL Queries and Mutations
const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      completed
      
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
      id
      title
      description
      completed

    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $title: String, $description: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, description: $description, completed: $completed) {
      id
      title
      description
      completed

    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id)
  }
`;

function TodoApp() {
  const { data, refetch } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateTodo = async () => {
    if (newTitle && newDescription) {
      await createTodo({
        variables: { title: newTitle, description: newDescription },
      });
      setNewTitle('');
      setNewDescription('');
      refetch();
    }
  };

  const handleUpdateTodo = async (id, currentTitle, currentDescription, currentCompleted) => {
    const newTitle = prompt("Edit Todo Title", currentTitle) || currentTitle;
    const newDescription = prompt("Edit Todo Description", currentDescription) || currentDescription;
    const newCompleted = !currentCompleted;

    await updateTodo({
      variables: {
        id,
        title: newTitle,
        description: newDescription,
        completed: newCompleted,
      },
    });
    refetch();
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo({
      variables: { id },
    });
    refetch();
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto', paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Todo List
      </Typography>

      {/* Create Todo Section */}
      <Box display="flex" gap={2} marginBottom={4}>
        <TextField
          label="Title"
          variant="outlined"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Description"
          variant="outlined"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleCreateTodo}>
          Add Todo
        </Button>
      </Box>

      {/* Todo List Section */}
      <List>
        {data?.todos?.map((todo) => (
          <ListItem key={todo.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={todo.completed} onChange={() => handleUpdateTodo(todo.id, todo.title, todo.description, todo.completed)} />
            <ListItemText primary={todo.title} secondary={todo.description} />
            <IconButton onClick={() => handleUpdateTodo(todo.id, todo.title, todo.description, todo.completed)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <TodoApp />
    </ApolloProvider>
  );
}

export default App;
