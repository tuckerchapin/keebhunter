<script>
import { mapState } from 'vuex';
import TagBucket from '@/components/TagBucket.vue';
import TagChip from '@/components/TagChip.vue';

export default {
  name: 'TagList',

  props: {
    selectedTags: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showMoreDisabled: {},
    };
  },

  computed: {
    ...mapState(['tags']),

    allTags() {
      return this.tags.map(({ category, total, tags }) => ({
        category,
        total,
        tags: [
          ...tags,
          ...this.selectedTags
            .filter((tag) => tag.category === category) // only selected tags in the same category
            .filter((selectedTag) => tags.every((tag) => tag.id !== selectedTag.id)), // only selected tags that don't match the defaults
        ],
      }));
    },

    selectedTagIds() {
      return this.selectedTags.reduce((acc, cur) => {
        acc[cur.id] = true;
        return acc;
      }, {});
    },
  },

  methods: {
    addTag(tag) {
      if (!this.selectedTagIds[tag.id]) {
        this.$emit('change', [...this.selectedTags, tag]);
      }
    },

    removeTag(tag) {
      if (this.selectedTagIds[tag.id]) {
        this.$emit('change', [...this.selectedTags.filter((productTag) => productTag.id !== tag.id)]);
      }
    },

    handleClick(tag) {
      if (!this.disabled) {
        if (this.selectedTagIds[tag.id]) {
          this.removeTag(tag);
          this.$emit('remove', tag);
        } else {
          this.addTag(tag);
          this.$emit('add', tag);
        }
      }
    },

    async hanldeShowMore(category) {
      if (!this.showMoreDisabled[category]) {
        this.$set(this.showMoreDisabled, category, true);
        await this.$store.dispatch('getMoreTags', { category });
        this.$set(this.showMoreDisabled, category, false);
      }
    },
  },

  render() {
    return (
      <div class="filter-list">
        {this.allTags.map(({ category, total, tags }) => (
          <div class="filter-category">
            <div class="filter-category-title">
              {category}
            </div>
            <TagBucket class="filter-tags">
              {tags.map((tag) => (
                <TagChip
                  tag={tag}
                  selected={this.selectedTagIds[tag.id]}
                  onClick={() => this.handleClick(tag)}
                />
              ))}
              {total > tags.length && !this.disabled ? (
                <div
                  class={{
                    'show-more': true,
                    disabled: this.showMoreDisabled[category],
                  }}
                  onClick={() => this.hanldeShowMore(category)}>
                  show more
                </div>
              ) : null}
            </TagBucket>
          </div>
        ))}
      </div>
    );
  },
};
</script>

<style scoped>
.filter-list {
  display: grid;
  grid-template-columns: auto;
  row-gap: 10px;
}

.filter-category-title {
  margin-bottom: 5px;
}

.filter-tags {
  margin-left: 20px;
}

.show-more {
  font-size: .8em;
  align-self: flex-end;
  cursor: pointer;
  user-select: none;
}

  .show-more.disabled {
    opacity: .5;
    cursor: unset;
  }
</style>
