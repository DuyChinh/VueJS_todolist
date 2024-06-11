<script setup>
    import { ref } from 'vue'
    import axios from 'axios';
    import { onMounted, watchEffect, nextTick, watch } from 'vue';
    import { useAuth0 } from '@auth0/auth0-vue';
    const auth0 = useAuth0();
    const { isAuthenticated, user, isLoading } = useAuth0();

    const apiKey = import.meta.env.VITE_API_KEY;
    const newTodo = ref("");
    let id = 0;
    const editingTodoId = ref(null);
    let disableEditing = ref(false);
    const statusTodo = ref(false);
    const loading = ref(true);
    const inputRef = ref(null);
    let todos = ref([]);
    if(!isAuthenticated) {
      loading.value = false;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiKey}/todos`);
        let list =[];
        if(isAuthenticated) {
          const todolist = response.data.data;
          list = todolist.filter((todo) => todo.user_id === user.value.sub);
        }
        todos.value = list;
      } catch (error) {
        // console.error(error);
      } finally {
        loading.value = false;
      }
    };

    
    fetchData();
    
    watch(isAuthenticated, async (newVal, oldVal) => {
      if (newVal && !oldVal) { 
        loading.value = true;
        await fetchData();
      }
    });

    const addTodo = async() => {
      todos.value.push({ id: id++, text: newTodo.value, status: false});
      const text = newTodo.value;
      newTodo.value = "";
      if(isAuthenticated) {
        await axios.post(`${apiKey}/todos`, {text, user_id: user.value?.sub});
      }
      // fetchData();

    }

    const deleteTodo = async(todo) => {
      todos.value = todos.value.filter((todoItem) => todoItem !== todo);
      if(isAuthenticated) {
        await axios.post(`${apiKey}/todos/${todo.id}`);
      }
      fetchData();
    }

    const editTodo = (todo) => {
      editingTodoId.value = todo.id;
      disableEditing.value = false;
      todo.status = false;
      nextTick(() => {
        inputRef.value.forEach((item) => {
          item.focus();
        })
      });
    }

    const updateTodo = async(todo)=> {
      disableEditing.value = true;
      if(isAuthenticated) {
        await axios.patch(`${apiKey}/todos/${todo.id}`, { text: todo.text});
      }
    }

    const updateStatus = async(todo) => {
      todo.status = !todo.status;
      if(isAuthenticated) {
        await axios.patch(`${apiKey}/todos/${todo.id}`, { status: todo.status});
      }
      disableEditing.value = true;
      // fetchData();
    }

</script>

<template>
  <h1 class="text-center mt-4">To do list DC</h1>
  <div class="todo mx-auto">
    <form @submit.prevent="addTodo" class="form d-flex">
        <input v-model="newTodo" class="inputMain" placeholder="New todo..." required>
        <button class="btn-add">Add Todo</button>
    </form>
    <div v-if="loading" class="todo mx-auto text-center mt-5" style="font-size: 20px; font-weight: 600;">
      Loading...
    </div>
    <ul v-if="todos.length > 0 && !loading" class="list-todo">
      <li v-for="todo in todos" :key="todo.id" :class="{ 'el-todo': true, 'bg-primary': !todo.status ,  'bg-success': todo.status }">
        <i class="fa fa-solid fa-check" v-if="todo.status" @click="updateStatus(todo)"></i>
        <i class="fa fa-regular fa-square" v-else @click="updateStatus(todo)"></i>

        <input ref="inputRef" :class="{'todo-item': true, 'text-decoration-line-through': todo.status, 'text-primary': !todo.status}" v-model="todo.text" :disabled="editingTodoId !== todo.id || disableEditing" @keyup.enter="updateTodo(todo)" @blur="updateTodo(todo)">

        <div class="todo-action">
          <button class="btn-icon btn-delete" @click="deleteTodo(todo)">
            <i class="fa-solid fa-trash"></i>
          </button class="btn-icon btn-delete">
          <button class="btn-icon btn-edit" @click="editTodo(todo)">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>



<style>
  .todo {
    width: 35%;
  }

  .inputMain {
    padding: 0 10px;
    width: 80%;
    border: 1px solid #ccc;
    outline: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  
  .inputMain:focus-within {
    border: 1px solid rgba(0, 0, 255, 0.726);
  }

  .btn-add {
    width: 20%;
    padding: 7px 8px;
    border: none;
    background: blue;
    color: #fff;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .list-todo {
    width: 100%;
    margin-top: 10px;
    background: linear-gradient(to right, rgb(235, 51, 73), rgb(244, 92, 67));
    /* background: linear-gradient(to right, rgb(255, 128, 8), rgb(255, 200, 55)); */
    border-radius: 4px;
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    gap: 8px;
    padding: 10px 0;
  }

  .el-todo {
    width: 90%;
    margin: 0 auto;
    /* background: violet; */
    border-radius: 4px;
    padding: 6px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .inputCheckBox {
    cursor: pointer;
  }

  .todo-item {
    width: 70%;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    outline: none;
    font-size: 18px;
    font-weight: 600;
    background: #fff;
  }

  .todo-item:focus {
    outline: 2px solid #12D8FA;
  }

  .btn-icon {
    border: none;
    background: transparent;
    color: #fff;
    margin-left: 15px;
    font-size: 18px;
  }

  .btn-delete:hover {
    color: orangered;
  }

  .btn-edit:hover {
    color: yellow;
  }

  .fa {
    color: #fff;
    cursor: pointer;
  }
</style>
