<script>
export default {
  name: 'ProductUrl',

  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
    };
  },

  computed: {
  },

  methods: {
  },

  render() {
    if (this.editing) {
      return (
        <input
          class="url-input"
          value={this.url}
          onInput={(e) => this.$emit('change', e.target.value)}
          placeholder="Add URL (vendor site, Deskthority wiki, GB, IC, etc.)..."
          tabindex="0"
        />
      );
    }

    return (
      <a class="url-display" href={this.url} target="_blank">
        {this.url}
      </a>
    );
  },
};
</script>

<style scoped>
.url-display,
.url-input {
  font-size: 1em;
  color: var(--product__name-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: monospace;
}

.url-display {
  text-decoration: none;
}

  .url-display:hover {
    color: var(--bright-blue);
    text-decoration: underline;
  }

.url-input {
  outline: none;
  height: calc(100% - 2px);
  padding-left: 10px;
  background-color: var(--product__name-editing-background);
  border-color: var(--product__name-editing-border);
}

  .url-input:focus {
    border-color: var(--product__name-editing-focus-border);
  }
</style>
