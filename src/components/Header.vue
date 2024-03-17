<script setup>
    import { useAuth0 } from '@auth0/auth0-vue';
    const auth0 = useAuth0();
    const { isAuthenticated, user } = useAuth0();
    // console.log("user", user);
    // console.log(user.value.picture);
    const login = () => {
      auth0.loginWithRedirect();
    }

    const logout = ()=> {
      auth0.logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      });
    }
</script>

<template>
  <div class="header">
     <div>
        <p class="title">Todo</p>
     </div>
     <div class="d-flex align-items-center gap-5">
      <div class="d-flex align-items-center gap-2">
        <img v-if="isAuthenticated && auth0.user.value" :src="auth0.user.value.picture" alt="" class="avatar">
        <div v-if="isAuthenticated" class="username">{{ auth0.user.value?.name ||  auth0.user.value?.nickname }}</div>
      </div>
      <button v-if="!isAuthenticated" @click="login" class="btn btn-primary">Log in</button>
      <button v-if="isAuthenticated" @click="logout" class="btn btn-danger">Log out</button>
    </div>
  </div>
</template>

<style>
    .header {
        /* height: 40px; */
        background: blueviolet;
        padding:10px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .title {
      font-size: 40px;
      font-weight: 600;
      color: #fff;
      margin-top: 10px;
    }

    .avatar {
      border-radius: 50%;
      width: 45px;
      height: 45px;
    }

    .username {
      font-size: 18px;
      color: #fff;
    }
</style>
