<script>
export default {
  name: 'ProductTitle',

  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  render() {
    if (this.editing) {
      return (
        <input
          class="title-input"
          value={this.title}
          onInput={(e) => this.$emit('change', e.target.value)}
          placeholder="Add name..."
          autofocus
          tabindex="0"
        />
      );
    }

    return (
      <div class="title-display">
        {this.title}
      </div>
    );
  },
};
</script>

<style scoped>
.title-display,
.title-input {
  font-size: 3em;
  color: var(--product__name-color);
  border: 1px solid transparent;
  border-radius: 4px;
}

.title-input {
  outline: none;
  padding: 0;
  padding-left: 10px;
  background-color: var(--product__name-editing-background);
  border-color: var(--product__name-editing-border);
}

  .title-input:focus {
    border-color: var(--product__name-editing-focus-border);
  }
</style>
