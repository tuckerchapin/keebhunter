<script>
import { mapState, mapGetters } from 'vuex';
import { Tag } from '@/lib';
import AppFrame from '@/views/AppFrame.vue';
import TagList from '@/components/TagList.vue';
import TagInput from '@/components/TagInput.vue';
import ProductResult from '@/components/ProductResult.vue';
import Button from '@/components/Button.vue';

const URL_QUERY_JOINER = ',';

export default {
  name: 'Search',

  data() {
    return {
      queryTags: [],
      loading: false,
      results: [],
      total: 0,
      onlyUnapproved: false,
    };
  },

  computed: {
    ...mapState([
      'loggedIn',
    ]),

    ...mapGetters([
      'allTagsByCategory',
      'isPrivileged',
    ]),

    selectedTagIds() {
      return this.queryTags.reduce((acc, cur) => {
        acc[cur.id] = true;
        return acc;
      }, {});
    },

    showUnapprovedButton() {
      return this.onlyUnapproved || (this.isPrivileged && this.queryTags.length === 0);
    },
  },

  watch: {
    queryTags() {
      this.update();
    },

    isPrivileged(newState) {
      if (!newState) {
        this.getResults(true);
      }
    },

    loggedIn() {
      this.getResults(true);
    },
  },

  async created() {
    // try to parse a query from the url
    if ('q' in this.$route.query) {
      try {
        // parse and dedupe
        const queryTagIds = [...new Set(this.$route.query.q.split(URL_QUERY_JOINER).filter((queryTagId) => queryTagId))];

        // get tags
        const test = await Promise.all(queryTagIds.map((tagId) => {
          const tagQuery = new this.$parse.Query(Tag);
          return tagQuery.get(tagId);
        }));

        this.queryTags = test;
      } catch (e) {
        // likely a malformed query string, do nothing
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    // initialize
    this.update();
  },

  methods: {
    update() {
      // propagate change to url query
      const queryString = this.queryTags.map((tag) => tag.id).join(URL_QUERY_JOINER);
      if ((this.$route.query.q || '') !== queryString) {
        // only replace if they are different
        if (this.queryTags.length > 0) {
          this.$router.replace({ query: { q: queryString } });
        } else {
          this.$router.replace({ query: {} });
        }
      } else if ('q' in this.$route.query && !this.$route.query.q) {
        this.$router.replace({ query: {} });
      }

      this.getResults(true);
    },

    async getResults(clear = false) {
      if (!this.loading) {
        this.loading = true;
        try {
          const { count, results } = await this.$parse.Cloud.run('search', {
            tags: Object.keys(this.selectedTagIds),
            skip: clear ? 0 : this.results.length,
            onlyUnapproved: this.onlyUnapproved,
          });
          this.total = count;
          this.results = clear ? results : [...this.results, ...results];
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          this.error = true;
        }
        this.loading = false;
      }
    },

    addQueryTag(tag) {
      if (!this.loading && !this.selectedTagIds[tag.id]) {
        this.queryTags = [...this.queryTags, tag];
      }
    },

    removeQueryTag(tag) {
      if (!this.loading && this.selectedTagIds[tag.id]) {
        this.queryTags = [...this.queryTags.filter((queryTag) => queryTag.id !== tag.id)];
      }
    },

    toggleQueryTag(tag) {
      if (this.selectedTagIds[tag.id]) {
        this.removeQueryTag(tag);
      } else {
        this.addQueryTag(tag);
      }
    },

    setQueryTag(tag) {
      if (!this.loading) {
        this.queryTags = [tag];
      }
    },

    handleClear() {
      if (!this.loading) {
        this.queryTags = [];
      }
    },

    handleOnlyUnapprovedToggle() {
      this.onlyUnapproved = !this.onlyUnapproved;
      this.getResults(true);
    },
  },

  render() {
    return (
      <AppFrame onClick={this.handleClear}>
        <TagList
          slot="left"
          selectedTags={this.queryTags}
          onRemove={this.removeQueryTag}
          onAdd={this.addQueryTag}
        />

        <div class={{
          results: true,
          loading: this.loading,
        }}>
          <TagInput
            placeholder="Filter by tags..."
            tags={this.queryTags}
            onRemove={this.removeQueryTag}
            onAdd={this.addQueryTag}
          />
          <div class="intermediate-container">
            <div class="status-text">
              {this.loading ? 'Loading...' : `Showing ${this.results.length} of ${this.total} results`}
            </div>
            <div class="buttons">
              <Button
                class={{ hide: !(this.queryTags.length > 0) }}
                onClick={this.handleClear}
                disabled={this.queryTags.length === 0}
                label="Clear filters"
              />
              <Button
                class={{ hide: !this.showUnapprovedButton }}
                onClick={this.handleOnlyUnapprovedToggle}
                label="Unapproved"
                color="red"
              />
            </div>
          </div>
          {this.results.length > 0 ? (
            <div class="results-table">
              {this.results.map((result) => (
                <ProductResult product={result} onClick={(tag) => this.addQueryTag(tag)}/>
              ))}
              <Button
                class={{
                  'load-button': true,
                  hide: this.results.length === this.total,
                }}
                label="Load more"
                size="medium"
                onClick={this.getResults}
                disabled={this.loading}
              />
            </div>
          ) : (
            <div class="no-results">
              <div>No results</div>
            </div>
          )}
        </div>
      </AppFrame>
    );
  },
};
</script>

<style scoped>
.results {
  display: grid;
  grid-template-columns: auto;
  row-gap: 10px;
  align-content: flex-start;
}

.intermediate-container {
  display: grid;
  grid-template-columns: min-content 1fr;
  justify-content: left;
  align-items: center;
  column-gap: 10px;
  height: calc(10px + .75em + 2px);
  white-space: nowrap;
}

  .intermediate-container .buttons {
    justify-self: flex-end;
    display: flex;
    flex-direction: row;
    margin-left: -10px;
  }

  .intermediate-container .buttons > * {
    margin-left: 10px;
  }

.status-text {
  user-select: none;
  color: var(--search__status-text-color);
}

.results-table {
  display: grid;
  grid-template-columns: auto;
  row-gap: 10px;
}

.no-results {
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  justify-content: center;
  align-items: center;
}

.loading .results-table,
.loading .no-results {
  pointer-events: none;
  opacity: .5;
}

.load-button {
  justify-self: center;
  margin: 20px 0;
}
</style>
