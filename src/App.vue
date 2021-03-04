<script>
export default {
  name: 'App',

  beforeCreate() {
    this.$store.dispatch('hydrate');
  },

  render() {
    return (
      <div id="app">
        <router-view/>
      </div>
    );
  },
};
</script>

<style>
@import 'normalize.css';

html {
  height: 100%;
  background-color: var(--app__background);
}

body {
  height: 100%;
  font-family: sans-serif;
  background-color: var(--app__background);
  font-size: 1em;
}

#app {
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  background-color: var(--app__background);
  color: var(--app_color);
}

.hide {
  display: none !important;
}

@media (min-width: 1400px) {
  #app {
    justify-content: center;
    grid-template-columns: 1400px;
  }
}

:root {
  --light-grey: hsl(0, 0%, 80%);
  --dark-grey: hsl(0, 2%, 60%);
  --light-blue: hsl(215, 50%, 70%);
  --bright-blue: hsl(215, 95%, 70%);
  --deep-black: hsl(225, 6%, 13%);
  --shallow-black: hsl(228, 5%, 22%);
  --red: hsl(0, 78%, 63%);

  --app__background: white;
  --app_color: var(--deep-black);
  --modal__background: white;

  --tag-chip__default-color: var(--deep-black);
  --tag-chip__default-background: var(--light-grey);
  --tag-chip__selected-color: var(--deep-black);
  --tag-chip__selected-background: var(--light-blue);

  --tag-input__color: var(--deep-black);
  --tag-input__background: transparent;
  --tag-input__hint-color: var(--deep-black);
  --tag-input__highlight-color: var(--deep-black);
  --tag-input__highlight-background: var(--bright-blue);
  --tag-input__hint-background: hsl(0, 0%, 100%);
  --tag-input__border-color: var(--dark-grey);
  --tag-input__hint-blur: 5px;
  --tag-input__hint-border-color: var(--dark-grey);
  --tag-input__focus-border-color: var(--light-blue);

  --button-background: transparent;
  --button-border: var(--light-blue);
  --button-color: var(--light-blue);
  --button-hover-background: var(--light-blue);
  --button-hover-border: var(--light-blue);
  --button-hover-color: var(--deep-black);
  --button-hover-background: var(--light-blue);
  --button-hover-border: var(--light-blue);
  --button-hover-color: var(--deep-black);
  --button-disabled-background: transparent;
  --button-disabled-border: var(--light-grey);
  --button-disabled-color: var(--light-grey);

  --search__attribution-color: var(--light-grey);
  --search__result-background: rgba(0, 0, 0, 0.1);
  --search__status-text-color: var(--dark-grey);

  --search__result-name-color: var(--deep-black);
  --search__result-name-hover-color: var(--bright-blue);

  --product__name-color: var(--deep-black);
  --product__name-editing-background: var(--light-grey);
  --product__name-editing-border: var(--dark-grey);
  --product__name-editing-focus-border: var(--bright-blue);

  --user__input-background: var(--light-grey);
  --user__input-focus-border: var(--bright-blue);

  --suggest-tag__title-color: var(--deep-black);

  --image-upload__border: var(--light-blue);
  --image-upload__not-draggable-border: var(--light-grey);
  --image-upload__remove-color: var(--red);
  --image-upload__remove-color-disabled: var(--light-grey);

  --image-upload__input-background-disabled: var(--light-grey);
  --image-upload__input-color-disabled: var(--shallow-black);
  --image-upload__input-border-disabled: var(--dark-grey);
  --image-upload__input-background: transparent;
  --image-upload__input-color: var(--bright-blue);
  --image-upload__input-border: var(--light-blue);

  --image-progress__active-background: var(--light-blue);
  --image-progress__active-color: var(--app-color);
  --image-progress__background-background: var(--light-grey);
  --image-progress__background-color: white;

    --footer__border: var(--light-grey);
    --footer__icon-fill: black;
    --footer__text: var(--light-grey);
}

@media (prefers-color-scheme: dark) {
  :root {
    --app__background: var(--deep-black);
    --app_color: lightblue;
    --modal__background: var(--shallow-black);

    --tag-chip__default-color: var(--deep-black);
    --tag-chip__default-background: var(--dark-grey);
    --tag-chip__selected-color: var(--deep-black);
    --tag-chip__selected-background: lightblue;

    --tag-input__color: white;
    --tag-input__background: var(--shallow-black);
    --tag-input__hint-color: var(--light-grey);
    --tag-input__highlight-color: white;
    --tag-input__highlight-background: var(--bright-blue);
    --tag-input__hint-background: var(--shallow-black);
    --tag-input__border-color: var(--dark-grey);
    --tag-input__hint-blur: 5px;
    --tag-input__hint-border-color: var(--dark-grey);
    --tag-input__focus-border-color: var(--light-blue);

    --search__attribution-color: var(--dark-grey);
    --search__result-background: rgba(256, 256, 256, 0.1);
    --search__status-text-color: var(--dark-grey);
    --button-background: transparent;
    --button-border: lightblue;
    --button-color: lightblue;
    --button-hover-background: lightblue;
    --button-hover-border: lightblue;
    --button-hover-color: var(--deep-black);
    --button-hover-background: lightblue;
    --button-hover-border: lightblue;
    --button-hover-color: var(--deep-black);
    --button-disabled-background: transparent;
    --button-disabled-border: var(--dark-grey);
    --button-disabled-color: var(--dark-grey);

    --search__result-name-color: lightblue;
    --search__result-name-hover-color: var(--bright-blue);
    --search__result-name-active-color: var(--bright-blue);

    --product__name-color: white;
    --product__name-editing-background: var(--shallow-black);
    --product__name-editing-border: var(--light-grey);
    --product__name-editing-focus-border: var(--bright-blue);

    --user__input-background: var(--light-grey);
    --user__input-focus-border: var(--bright-blue);

    --suggest-tag__title-color: white;

    --image-upload__border: var(--light-blue);
    --image-upload__not-draggable-border: var(--dark-grey);
    --image-upload__remove-color: var(--red);
    --image-upload__remove-color-disabled: var(--dark-grey);

    --image-upload__input-background-disabled: var(--shallow-black);
    --image-upload__input-color-disabled: var(--dark-grey);
    --image-upload__input-border-disabled: var(--dark-grey);
    --image-upload__input-background: transparent;
    --image-upload__input-color: var(--bright-blue);
    --image-upload__input-border: var(--bright-blue);

    --image-progress__active-background: var(--bright-blue);
    --image-progress__active-color: var(--deep-black);
    --image-progress__background-background: var(--dark-grey);
    --image-progress__background-color: white;

    --footer__border: var(--shallow-black);
    --footer__icon-fill: white;
    --footer__text: var(--shallow-black);
  }
}
</style>
