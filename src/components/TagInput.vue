<script>
import { utils } from '@/lib';
import TagChip from '@/components/TagChip.vue';

const DEFAULT_HIGHLIGHT = 0;
const CONFIRM_KEYS = {
  Enter: true,
  Comma: true,
  Tab: true,
};

export default {
  name: 'TagInput',

  props: {
    tags: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Enter tags...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tagSearch: '',
      hints: [],
      highlightedHint: DEFAULT_HIGHLIGHT,
      inputFocused: true,
      lastKeydown: false,
      lastLength: 0,
      clickingHint: false,
    };
  },

  computed: {
    sanitizedSearch() {
      return utils.sanitizeForSearch(this.tagSearch);
    },

    showHint() {
      return this.inputFocused || this.clickingHint;
    },

    selectedTagIds() {
      return this.tags.reduce((acc, cur) => {
        acc[cur.id] = true;
        return acc;
      }, {});
    },
  },

  watch: {
    async tagSearch() {
      if (this.sanitizedSearch) {
        this.hints = await this.$parse.Cloud.run('tagHint', {
          fragment: this.sanitizedSearch,
          exclude: Object.keys(this.selectedTagIds),
        });
        this.highlightedHint = DEFAULT_HIGHLIGHT;
      } else {
        this.hints = [];
      }
    },
  },

  methods: {
    addTag(tag) {
      if (!this.selectedTagIds[tag.id]) {
        this.$emit('change', [...this.tags, tag]);
      }
    },

    removeTag(tag) {
      if (this.selectedTagIds[tag.id]) {
        this.$emit('change', [...this.tags.filter((productTag) => productTag.id !== tag.id)]);
      }
    },

    highlightSubstring(str, highlight) {
      // find all occurences of the starting letter
      // find all occurences of the ending letter
      // pick the closest with at least as many characters at the sanitized version, but not fewer
      const lowercased = str.toLowerCase();
      const startChar = highlight.charAt(0);
      const endChar = highlight.charAt(highlight.length - 1);

      const startIdxs = [];
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < lowercased.length; i++) {
        if (lowercased[i] === startChar) startIdxs.push(i);
      }

      const endIdxs = [];
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < lowercased.length; i++) {
        if (lowercased[i] === endChar) endIdxs.push(i);
      }

      let start = startIdxs[0];
      let end = endIdxs[0];
      // eslint-disable-next-line no-restricted-syntax
      for (const i of startIdxs) {
        // eslint-disable-next-line no-restricted-syntax
        for (const j of endIdxs) {
          if (j >= i) {
            if (j + 1 - i === highlight.length) {
              // exact match
              start = i;
              end = j;
              break;
            } else if (j + 1 - i > highlight.length && j - i < end - start) {
              // match across sanitized characters
              start = i;
              end = j;
            }
          }
        }
      }

      return [
        str.slice(0, start),
        str.slice(start, end + 1),
        str.slice(end + 1),
      ];
    },

    handleHintClick(tag) {
      this.addTag(tag);
      this.$emit('add', tag);
      this.tagSearch = '';
    },

    handleKeyup(e) {
      const { code } = e;
      if (CONFIRM_KEYS[code] && this.hints.length > 0) {
        this.addTag(this.hints[this.highlightedHint]);
        this.$emit('add', this.hints[this.highlightedHint]);
        this.tagSearch = '';
      } else if (code === 'Backspace' && !this.tagSearch && this.tags.length > 0) {
        // this "debounces" the backspace event
        // so if the user deletes the last character onKeydown it doesn't also delete a tag onKeyup
        if (!(this.lastKeydown === code && this.lastLength > this.tagSearch)) {
          this.removeTag(this.tags[this.tags.length - 1]);
          this.$emit('remove', this.tags[this.tags.length - 1]);
        } else if (this.lastKeydown === code) {
          this.lastLength = 0;
        }
      } else if (code === 'ArrowUp') {
        if (this.highlightedHint > 0) {
          this.highlightedHint--;
        } else if (this.highlightedHint === -1) {
          this.highlightedHint = this.hints.length - 1;
        }
      } else if (code === 'ArrowDown') {
        if (this.highlightedHint < this.hints.length - 1) {
          this.highlightedHint++;
        }
      }
    },

    handleKeydown(e) {
      if (CONFIRM_KEYS[e.code]) {
        e.preventDefault();
      }

      if (this.lastKeydown !== 'Backspace') {
        this.lastLength = this.tagSearch.length;
      }
      this.lastKeydown = e.code;
    },
  },

  render() {
    return (
      <div
        class={{
          'tag-input-container': true,
          'input-focused': this.inputFocused,
          'no-tags': this.showHint && this.tags.length === 0 && this.tagSearch.length !== 0,
          disabled: this.disabled,
        }}
        onClick={() => this.$refs.input.focus()}
      >
        {this.tags.map((tag) => (
          <TagChip
            tag={tag}
            selected={true}
            removable={!this.disabled}
            onRemove={() => { if (!this.disabled) this.removeTag(tag); this.$emit('remove', tag); }}
          />
        ))}
        <div class={{
          'hint-anchor': true,
          hide: this.disabled,
        }}>
          <input
            ref="input"
            class="tag-input"
            placeholder={this.placeholder}
            value={this.tagSearch}
            onInput={(e) => { this.tagSearch = e.target.value; }}
            onKeyup={this.handleKeyup}
            onKeydown={this.handleKeydown}
            onFocus={() => { this.inputFocused = true; }}
            onBlur={() => { this.inputFocused = false; }}
            autofocus
            tabindex="0"
            disabled={this.disabled}
          />
          {this.tagSearch.length > 0 && this.showHint ? (
            <div
              class="hint-container"
            >
              {this.hints.length > 0
                ? this.hints.map((hint, i) => {
                  const [start, highlight, end] = this.highlightSubstring(hint.label, this.sanitizedSearch);
                  return (
                    <div
                      class={{
                        hint: true,
                        highlighted: this.highlightedHint === i,
                      }}
                      onClick={() => this.handleHintClick(hint) }
                      onMouseenter={() => { this.highlightedHint = i; }}
                      onMousedown={(e) => { e.preventDefault(); this.clickingHint = true; }}
                      onMouseup={() => { this.clickingHint = false; }}
                      onTouchstart={() => { this.clickingHint = true; this.highlightedHint = i; }}
                      onTouchend={() => { this.clickingHint = false; }}
                    >
                      {start}
                      <b>{highlight}</b>
                      {end}
                    </div>
                  );
                })
                : (
                  <div class="hint"> No tags found </div>
                )
              }
            </div>
          ) : null}
        </div>
      </div>
    );
  },
};
</script>

<style scoped>
.tag-input-container {
  --tag-input__padding: 10px;
  --tag-input__gap: 5px;
  --tag-input__border-radius: 15.5px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 1;
  align-items: flex-start;
  gap: var(--tag-input__gap);
  min-height: calc(.75em + 10px);
  padding: var(--tag-input__padding);
  border: 1px solid var(--tag-input__border-color);
  border-radius: var(--tag-input__border-radius);
  background-color: var(--tag-input__background);
}

  .tag-input-container.input-focused {
    border-color: var(--tag-input__focus-border-color);
  }

  .tag-input-container.no-tags {
    border-bottom-left-radius: 0;
  }

  .tag-input-container.disabled {
    pointer-events: none;
  }

.hint-anchor {
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

.tag-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  height: calc(.75em + 10px);
  background-color: transparent;
  color: var(--tag-input__color);
}

.hint-container {
  position: absolute;
  background-color: var(--tag-input__hint-background);
  /* backdrop-filter: blur(var(--tag-input__hint-blur)); */
  left: calc(var(--tag-input__padding) * -1 - 1px);
  top: calc(.75em + 20px);
  border: 1px solid var(--tag-input__focus-border-color);
  border-top: none;
  border-bottom-left-radius: var(--tag-input__border-radius);
  border-bottom-right-radius: var(--tag-input__border-radius);
  overflow: hidden;
}

.hint {
  padding: var(--tag-input__gap) var(--tag-input__padding);
  user-select: none;
  cursor: pointer;
  color: var(--tag-input__hint-color);
}

  .hint.highlighted {
    background-color: var(--tag-input__highlight-background);
    color: var(--tag-input__highlight-color);
  }

  .hint b {
    font-weight: 600;
  }

.hint-anchor:first-child .tag-input {
  padding-left: var(--tag-input__gap);
}

.hint-anchor:first-child .hint {
  padding-left: calc(var(--tag-input__gap) + 5px);
}
</style>
