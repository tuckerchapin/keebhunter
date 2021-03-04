<script>
import { mapState, mapGetters } from 'vuex';
import { User, Tag } from '@/lib';
import AppFrame from '@/views/AppFrame.vue';
import Button from '@/components/Button.vue';

const timeout = null;

export default {
  name: 'SuggestTag',

  data() {
    return {
      label: '',
      categoryIndex: -1,
      success: false,
      disableSubmit: false,
    };
  },

  computed: {
    ...mapState([
      'isAdmin',
    ]),

    ...mapGetters(['allTagsByCategory']),

    categories() {
      return Object.keys(this.allTagsByCategory).sort();
    },

    category() {
      if (this.categoryIndex >= 0) {
        return this.categories[this.categoryIndex];
      }

      if (this.categoryIndex === 'new') {
        return 'new';
      }

      return '';
    },

    submitDisabled() {
      return !this.category || !this.label || this.label.length < 2 || this.disableSubmit;
    },
  },

  methods: {
    async save() {
      if (!this.disableSubmit) {
        this.disableSubmit = true;
        const tag = new Tag();
        tag.label = this.label;
        tag.category = this.category;
        tag.submittedBy = User.current();
        await tag.save()
          .then(() => {
            this.label = '';
            this.categoryIndex = -1;
            this.success = true;
            if (timeout) {
              clearTimeout(timeout);
            }
            setTimeout(() => { this.success = false; }, 5000);
          })
          // eslint-disable-next-line no-alert
          .catch((e) => alert(e.message));
        this.disableSubmit = false;
      }
    },
  },

  render() {
    return (
      <AppFrame>
        <div class="suggestion-box">
          <div class="title">
            Suggest a new tag
          </div>
          <input
            class="label-input"
            value={this.label}
            onInput={(e) => { this.label = e.target.value; }}
            type="text"
            placeholder="Tag name"
            inputmode="text"
            tabindex={1}
          />
          <select
            class={{
              'category-select': true,
              'category-invalid': !this.category,
            }}
            onChange={(e) => { this.categoryIndex = e.target.value; }}
            tabindex={1}
          >
            <option value={-1} selected={this.categoryIndex === -1}>Select category</option>
            {this.categories.map((category, i) => (
              <option value={i} selected={this.categoryIndex === i}>{category}</option>
            ))}
            <option value="new" selected={this.categoryIndex === 'new'}>Other/new category</option>
          </select>
          <Button
            label="Submit"
            size="fit medium"
            disabled={this.submitDisabled}
            borderless={this.submitDisabled}
            onClick={this.save}
          />
          <div class={{
            'success-message': true,
            hide: !this.success,
          }}>
            Suggestion noted. Thanks for helping out!
          </div>
        </div>
      </AppFrame>
    );
  },
};
</script>

<style scoped>
.suggestion-box {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 20px;
}

@media (min-width: 800px) {
  .suggestion-box {
    grid-template-columns: 400px;
    justify-content: center;
  }
}

.title {
  font-size: 2em;
  color: var(--suggest-tag__title-color);
}

.label-input,
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
  .label-input:focus {
    padding: 9px;
    border: 1px solid var(--user__input-focus-border);
  }

.category-invalid {
  color: var(--dark-grey);
}

.success-message {
  text-align: center;
}
</style>
