<script>
import { mapState } from 'vuex';
import { User } from '@/lib';
import Button from '@/components/Button.vue';

export default {
  name: 'UserState',

  data() {
    return {
      username: '',
      password: '',
      loading: false,
    };
  },

  computed: {
    ...mapState([
      'loggedIn',
    ]),
  },

  watch: {
    loggedIn: {
      immediate: true,
      async handler() {
        if (this.loggedIn) {
          const user = User.current();
          this.username = user.get('username');
        }
      },
    },
  },

  created() {
  },

  methods: {
    register() {
      if (!this.loading) {
        this.loading = true;
        this.$store.dispatch('register', { username: this.username, password: this.password })
          // eslint-disable-next-line no-alert
          .catch((e) => alert(e.message))
          .finally(() => {
            this.loading = false;
            this.password = '';
          });
      }
    },

    login() {
      if (!this.loading) {
        this.loading = true;
        this.$store.dispatch('login', { username: this.username, password: this.password })
          // eslint-disable-next-line no-alert
          .catch((e) => alert(e.message))
          .finally(() => {
            this.loading = false;
            this.password = '';
          });
      }
    },

    submit(e) {
      e.preventDefault();
    },

    logout() {
      if (!this.loading) {
        this.loading = true;
        this.$store.dispatch('logout')
          .finally(() => {
            this.loading = false;
            this.password = '';
          });
      }
    },
  },

  render() {
    if (this.loggedIn) {
      return (
        <div class={{
          'user-container': true,
          loading: this.loading,
        }}>
          <div class="username">
            {this.username}
          </div>
          <Button
            class="logout-button"
            onClick={this.logout}
            borderless={true}
            label="Logout"
            size="fit"
          />
        </div>
      );
    }

    return (
      <form
        class={{
          'no-user-container': true,
          loading: this.loading,
        }}
        onSubmit={this.submit}
      >
        <input
          class="username-input"
          value={this.username}
          onInput={(e) => { this.username = e.target.value; }}
          name="username"
          autocomplete="username"
          type="text"
          placeholder="Username"
          inputmode="text"
          tabIndex={1}
        />
        <input
          class="password-input"
          value={this.password}
          onInput={(e) => { this.password = e.target.value; }}
          name="password"
          autocomplete="current-password"
          type="password"
          placeholder="Password"
          inputmode="text"
          tabIndex={1}
        />
        <Button
          class="login-button"
          onClick={this.login}
          label="Login"
          size="fit"
        />
        <Button
          class="register-button"
          onClick={this.register}
          label="Register"
          size="fit"
        />
      </form>
    );
  },
};
</script>

<style scoped>
.no-user-container,
.user-container {
  --button-width: 80px;
  display: grid;
  height: 100%;
  column-gap: 5px;
  row-gap: 5px;
  justify-content: right;
  align-items: center;
  align-content: center;
}

  .no-user-container.loading,
  .user-container.loading {
    user-select: none;
    opacity: .5;
  }

.no-user-container {
  grid-template-areas:
    "userinput register"
    "passinput login";
  grid-template-columns: min-content var(--button-width);
  grid-template-rows: 1fr 1fr;
  align-items: flex-end;
}

.user-container {
  grid-template-areas:
    "username logout";
  grid-template-columns: min-content var(--button-width);
  grid-template-rows: min-content;
  align-items: center;
  justify-items: right;
  text-align: right;
  user-select: none;
}

.username-input,
.password-input {
  background-color: var(--user__input-background);
  font-size: .75em;
  border: none;
  border-radius: 4px;
  outline: none;
  padding: 4px 5px;
  margin: 0;
  height: calc(.75em + 10px);
}

  .username-input::placeholder,
  .password-input::placeholder {
    color: var(--deep-black);
  }

  .username-input:focus,
  .password-input:focus {
    padding: 3px 4px;
    border: 1px solid var(--user__input-focus-border);
  }

.username {
  grid-area: username;
}

.logout-button {
  grid-area: logout;
  margin: 1px 0;
}

.login-button {
  grid-area: login;
}

.register-button {
  grid-area: register;
}

.username-input {
  grid-area: userinput;
}

.password-input {
  grid-area: passinput;
}

@media (max-width: 1000px) {
  .no-user-container {
    grid-template-areas:
      "userinput passinput login register";
    grid-template-columns: repeat(2, 1fr) repeat(2, min-content);
    grid-template-rows: min-content;
  }

  .username {
    display: none;
  }
}
</style>
