<script>
export default {
  name: 'TagChip',

  props: {
    tag: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    removable: {
      type: Boolean,
      default: false,
    },
  },

  render() {
    return (
      <span
        class={{
          tag: true,
          selected: this.selected,
        }}
        onClick={(e) => this.$emit('click', e)}
      >
        <span
          class={{
            'tag-color': true,
            hide: !this.tag.color,
          }}
          style={`background: ${this.tag.color}`}
        >
        </span>
        {this.tag.label}
        {this.removable ? (
          <span
            class="remove-icon"
            onClick={(e) => {
              e.stopPropagation();
              this.$emit('remove');
            }}
          >
            ✕
          </span>
        ) : null}
      </span>
    );
  },
};
</script>

<style scoped>
.tag {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 100px;
  font-family: sans-serif;
  font-size: .75em;
  font-weight: normal;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  color: var(--tag-chip__default-color);
  background-color: var(--tag-chip__default-background);
}

.tag.selected {
  color: var(--tag-chip__selected-color);
  background-color: var(--tag-chip__selected-background);
}

.tag-color {
  display: inline-block;
  height: calc(.75em + 4px * 2 + 2px);
  width: calc(.75em + 4px * 2 + 2px);
  margin-left: -8px;
  margin-top: -4px;
  margin-bottom: -4px;
  margin-right: 4px;
  border: 1px solid white;
  border-radius: 100px;
}

.remove-icon {
  margin-left: 4px;
}
</style>
