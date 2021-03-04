<script>
import { User, Flag } from '@/lib';
import Button from '@/components/Button.vue';
import TagInput from '@/components/TagInput.vue';

const FLAG_CATEGORIES = [
  'Missing tags',
  'Incorrect tags',
  'Inaccurate information',
  'Inappropriate content',
  'Other',
];

export default {
  name: 'FlagModal',

  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      reason: '',
      tags: [],
      categoryIndex: -1,
      disableSubmit: false,
    };
  },

  computed: {
    category() {
      if (this.categoryIndex >= 0) {
        return FLAG_CATEGORIES[this.categoryIndex];
      }

      return '';
    },

    tagInputPlaceholder() {
      if (this.tags.length === 0) {
        if (this.categoryIndex === 0) {
          return 'Enter the missing tags (Optional)';
        }
        return 'Enter the incorrect tags (Optional)';
      }
      return 'Add tags...';
    },

    submitDisabled() {
      return this.disablSubmit || this.categoryIndex === -1;
    },
  },

  methods: {
    save() {
      this.disableSubmit = true;
      const flag = new Flag(this.product, User.current());
      flag.reason = this.reason;
      flag.category = this.category;
      flag.tags = this.tags;
      flag.save().then(() => this.$emit('close'));
    },
  },

  render() {
    return (
        <div class="flag-modal-content">
          <div class="title">
            What's wrong?
          </div>
          <select
            class={{
              'category-select': true,
              'category-invalid': !this.category,
            }}
            onChange={(e) => { this.categoryIndex = parseInt(e.target.value, 10); }}
          >
            <option value={-1} selected={this.categoryIndex === -1}>Select category</option>
            {FLAG_CATEGORIES.map((category, i) => (
              <option value={i} selected={this.categoryIndex === i}>{category}</option>
            ))}
          </select>
          <TagInput
            class={{
              'flag-tags': true,
              // eslint-disable-next-line eqeqeq
              hide: this.categoryIndex !== 0 && this.categoryIndex !== 1,
            }}
            placeholder={this.tagInputPlaceholder}
            tags={this.tags}
            onChange={(tags) => { this.tags = tags; }}
          />
          <textarea
            class="reason-input"
            value={this.reason}
            onInput={(e) => { this.reason = e.target.value; }}
            rows={3}
            placeholder="Description of the issue (Optional)"
            inputmode="text"
          />
          <Button
            label="Submit"
            size="fit medium"
            disabled={this.submitDisabled}
            onClick={this.save}
          />
        </div>
    );
  },
};
</script>
<style>
.flag-modal {
  background-color: var(--modal__background) !important;
  border-radius: 10px !important;
  height: auto !important;
}
</style>

<style scoped>
.flag-modal-content {
  padding: 20px;
  height: calc(100% - 40px);
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  justify-content: space-between;
  row-gap: 20px;
}

.title {
  font-size: 1.5em;
  color: var(--suggest-tag__title-color);
}

.reason-input {
  resize: none;
}

.reason-input,
.category-select {
  background-color: var(--user__input-background);
  font-size: 1em;
  border: none;
  border-radius: 4px;
  outline: none;
  padding: 10px;
  margin: 0;
}

  .category-select:focus,
  .reason-input:focus {
    padding: 9px;
    border: 1px solid var(--user__input-focus-border);
  }

.category-select {
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
  width: 100%;
}

.category-invalid {
  color: var(--dark-grey);
}
</style>
