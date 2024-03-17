import { createAuth0 } from '@auth0/auth0-vue';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(
  createAuth0({
    domain: "dev-cmpa2n8e4abebd1l.us.auth0.com",
    clientId: "tUFkAfNq6kL24n6CZ2CuOy5vgmalVtAG",
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  })
);

app.mount('#app');