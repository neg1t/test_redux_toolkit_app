import {
  configureStore,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { getTodos } from "./api";

interface TodoState {
  todos: string[];
  loading: boolean;
  error?: string;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await getTodos();
  return response.data.todos;
});

export const todoSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      if (state.todos.includes(action.payload)) {
        state.error = "Такая задача уже есть";
        return;
      }
      state.todos.push(action.payload);
    },
    clearError: (state) => {
      state.error = "";
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    });
    builder.addCase(fetchTodos.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,
  },
});

export const { addTodo, removeTodo, clearError } = todoSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
