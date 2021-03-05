<script>
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
import UserState from '@/components/UserState.vue';

export default {
  name: 'AppFrame',

  render() {
    const footerContent = () => (
      <div class="footer">
        <div class="footer-user">
          <UserState/>
        </div>
        <a
          class="gh-link"
          href="https://github.com/tuckerchapin/keebhunter"
          target="_blank"
          alt="Github"
          title="Github"
        >
          <svg class="gh-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.58 31.77">
            <path class="cls-1" d="M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z"/>
          </svg>
        </a>
        <a
          class="email-link"
          href="mailto:tuckerchapin+keebhunter@gmail.com"
          target="_blank"
          alt="Contact"
          title="Contact"
        >
          <svg class="email-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="m68.184 63.637c-4.1484 5.5195-10.75 9.0898-18.184 9.0898-12.551 0-22.727-10.176-22.727-22.727s10.176-22.727 22.727-22.727c7.4336 0 14.035 3.5703 18.184 9.0898v-9.0898h4.543v36.363c0 5.0078 4.5117 7.8789 9.7812 6.4492 6.3516-1.7266 10.84-8.7539 10.676-20.086 0-23.848-19.336-43.184-43.184-43.184s-43.184 19.336-43.184 43.184 19.336 43.184 43.184 43.184c9.3672 0 18.277-2.9883 25.648-8.4414l2.7031 3.6562c-8.1484 6.0234-18.004 9.3281-28.352 9.3281-26.359 0-47.727-21.367-47.727-47.727s21.367-47.727 47.727-47.727 47.727 21.367 47.727 47.695c0.19531 13.242-5.5195 22.191-14.027 24.504-7.9844 2.168-15.516-2.6211-15.516-10.836zm-18.184 4.5469c10.043 0 18.184-8.1406 18.184-18.184s-8.1406-18.184-18.184-18.184-18.184 8.1406-18.184 18.184 8.1406 18.184 18.184 18.184z"/>
          </svg>
        </a>
        <div class="footer-text">
          <p>All images are property of their respective owners. Products listed are user-submited. A listing here is not an endorsement. Group buys are inherently risky. Do your research.</p>

          <p>Love with your heart, use your head for everything else.</p>
        </div>
      </div>
    );
    return (
      <div class={{
        container: true,
        'one-column': !this.$slots.left,
      }}>
        <Header class="header" onClick={() => this.$emit('click')}/>
        <div class="topbar">
          <div class="submit-buttons">
            <Button
              class={{
                'submit-button': true,
                hide: this.$route.name === 'submit',
              }}
              label="Add anything keeb"
              size="medium"
              onClick={() => this.$router.push({ name: 'submit' })}
            />
            <Button
              class={{
                'submit-button': true,
                hide: this.$route.name === 'suggest-tag',
              }}
              label="Suggest a tag"
              size="medium"
              onClick={() => this.$router.push({ name: 'suggest-tag' })}
            />
          </div>
        </div>
        <div class="left">
          {this.$slots.left}
          {footerContent()}
        </div>
        <div class="main">
          {this.$slots.default}
          {footerContent()}
        </div>
      </div>
    );
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-areas:
    "header topbar"
    "lefty main";
  grid-template-columns: 1fr 2fr;
  grid-auto-rows: min-content;
  padding: 20px;
  column-gap: 20px;
  row-gap: 20px;
}

  .container.one-column {
    grid-template-areas:
      "header topbar"
      "main main";
    grid-template-columns: min-content 2fr;
  }

  .container.one-column .left {
    display: none;
  }

.header {
  grid-area: header;
}

.topbar {
  grid-area: topbar;
  display: grid;
  grid-template-columns: min-content 1fr;
  column-gap: 20px;
  align-content: center;
  align-items: center;
}

.submit-buttons {
  display: grid;
  grid-template-columns: min-content min-content;
  column-gap: 20px;
  row-gap: 10px;
}

.submit-button {
  white-space: nowrap;
}

.left {
  grid-area: lefty;
}

.main {
  grid-area: main;
}

.footer {
  display: grid;
  grid-template-areas:
    "user user"
    "gh email"
    "texty texty";
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  justify-items: center;
  column-gap: 20px;
  row-gap: 20px;
  margin: 20px 20px 0;
}

.footer-user {
  grid-area: user;
  border-bottom: 1px solid var(--footer__border);
  border-top: 1px solid var(--footer__border);
  padding: 20px;
  width: calc(100% - 40px);
}

.footer-text {
  grid-area: texty;
  color: var(--footer__text);
  text-align: center;
  font-size: .8em;
  padding: 0 20px;
  width: calc(100% - 40px);
}

  .footer-text > p {
    margin-top: 0;
  }

.gh-link {
  grid-area: gh;
  justify-self: flex-end;
}

.email-link {
  grid-area: email;
  justify-self: flex-start;
}

.gh-link,
.email-link {
  width: 2rem;
}

.gh-logo, .email-icon {
  fill: var(--footer__border);
}

.gh-link:hover .gh-logo,
.email-link:hover .email-icon {
  fill: var(--footer__icon-fill);
}
</style>

<!-- media queries -->
<style scoped>
@media (max-width: 1000px) {
  .container,
  .container.one-column {
    grid-template-areas:
      "header"
      "topbar"
      "main";
    grid-template-columns: auto;
  }

  .footer {
    margin: 0;
    margin-top: 10px;
  }

  .left {
    display: none;
  }
}

@media (min-width: 1000px) {
  .container:not(.one-column) .main .footer {
    display: none;
  }
}

@media (min-width: 1200px) {
  .container {
    grid-template-columns: 400px auto;
  }
}
</style>
