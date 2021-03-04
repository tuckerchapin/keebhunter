<script>
const BUTTON_SIZES = [
  'small',
  'medium',
  'large',
  'fit',
];

const BUTTON_COLORS = [
  '',
  'red',
];

export default {
  name: 'Button',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    borderless: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small',
      validator: (value) => {
        const values = value.split(' ');
        return values.every((val) => BUTTON_SIZES.includes(val));
      },
    },
    color: {
      type: String,
      default: '',
      validator: (value) => BUTTON_COLORS.includes(value),
    },
  },

  render() {
    return (
      <button
        class={{
          button: true,
          [this.size]: true,
          [this.color]: true,
          borderless: this.borderless,
        }}
        onClick={() => this.$emit('click')}
        disabled={this.disabled}
      >
        {this.$slots.default || this.label}
      </button>
    );
  },
};
</script>

<style scoped>
.button {
  padding: 4px 10px;
  justify-self: flex-start;
  border-radius: 5px;
  font-size: .75em;
  text-transform: uppercase;
  border: 1px solid;
  background-color: var(--button-background);
  border-color: var(--button-border);
  color: var(--button-color);
  outline: none;
  user-select: none;
}

.button.borderless {
  border: none;
  padding: 6px 12px;
}

  .button:not(:disabled) {
    cursor: pointer;
  }

  .button:disabled {
    background-color: var(--button-disabled-background);
    border-color: var(--button-disabled-border);
    color: var(--button-disabled-color);
  }

  .button:hover:not(:disabled) {
    background-color: var(--button-hover-background);
    border-color: var(--button-hover-border);
    color: var(--button-hover-color);
  }

  .button:active:not(:disabled) {
    background-color: var(--button-active-background);
    border-color: var(--button-active-border);
    color: var(--button-active-color);
    filter: brightness(.8);
  }

.button.small {

}

.button.medium {
  padding: 10px 15px;
  font-size: .9em;
}

.button.large {

}

.button.fit {
  align-self: stretch;
  justify-self: unset;
}

.button.red {
  border-color: var(--red);
  color: var(--red);
}

  .button.red:hover:not(:disabled) {
    background-color: var(--red);
    border-color: var(--red);
    color: var(--button-hover-color);
  }

  .button.red:active:not(:disabled) {
    filter: brightness(.8);
  }
</style>
