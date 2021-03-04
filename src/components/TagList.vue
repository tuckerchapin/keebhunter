<script>
import { mapGetters } from 'vuex';
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

  computed: {
    ...mapGetters(['allTagsByCategory']),

    sortedCategories() {
      return Object.keys(this.allTagsByCategory).sort();
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
  },

  render() {
    return (
      <div class={{
        'filter-list': true,
        disabled: this.disabled,
      }}>
        {this.sortedCategories.map((category) => [
          (
            <div class="tag-bucket-title">
              {category}
            </div>
          ),
          (
            <TagBucket class="filter-bucket">
              {this.allTagsByCategory[category].map((tag) => (
                <TagChip
                  tag={tag}
                  selected={this.selectedTagIds[tag.id]}
                  onClick={() => this.handleClick(tag)}
                />
              ))}
            </TagBucket>
          ),
        ])}
      </div>
    );
  },
};
</script>

<style scoped>
.filter-list {
  display: grid;
  grid-template-columns: auto;
  row-gap: 5px;
}

.filter-bucket {
  margin-left: 20px;
  margin-bottom: 5px;
}

.filter-list.disabled {
  pointer-events: none;
}
</style>
