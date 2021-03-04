<script>
import { mapState, mapGetters } from 'vuex';
import { User, Product, utils } from '@/lib';
import AppFrame from '@/views/AppFrame.vue';
import TagList from '@/components/TagList.vue';
import TagInput from '@/components/TagInput.vue';
import Button from '@/components/Button.vue';
import ProductTitle from '@/components/ProductTitle.vue';
import ProductUrl from '@/components/ProductUrl.vue';
import ProductImages from '@/components/ProductImages.vue';
import FlagModal from '@/components/FlagModal.vue';

const DEFAULT_STATE = () => ({
  editing: false,
  product: new Product(),
  tags: [],
  name: '',
  url: '',
  images: [],
  approved: false,
  saving: false,
});

export default {
  name: 'ProductPage',

  data: DEFAULT_STATE,

  computed: {
    ...mapState([
      'loggedIn',
      'isAdmin',
    ]),

    ...mapGetters([
      'allTagsByCategory',
      'isPrivileged',
    ]),

    pageState() {
      return this.editing ? 'edit' : this.$route.name;
    },

    id() {
      return this.$route.params.id;
    },

    editable() {
      return this.isAdmin || this.editing || this.pageState === 'submit';
    },

    saveable() {
      if (this.saving) {
        return false;
      }

      try {
        if (this.name !== this.product.name) {
          return true;
        }

        if (this.url !== this.product.url && this.url) {
          return true;
        }

        if (
          this.tags.length !== this.product.tags.length
          || this.product.tags.some((tag, i) => tag && this.tags[i] && tag.label !== this.tags[i].label)
        ) {
          return true;
        }

        if (
          this.images.length !== this.product.images.length // first check different lengths
          || this.images.some((image, i) => !(image && this.product.images[i] && image.url && this.product.images[i].url && image.url() === this.product.images[i].url()))
        ) {
          return true;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        // do nothing and return false
      }

      return false;
    },

    selectedTagIds() {
      return this.tags.reduce((acc, cur) => {
        acc[cur.id] = true;
        return acc;
      }, {});
    },
  },

  watch: {
    id: {
      immediate: true,
      async handler() {
        if (this.id) {
          try {
            const productQuery = new this.$parse.Query(Product);
            productQuery.include('tags');
            this.product = await productQuery.get(this.id);
            document.title = `Keebhunter - ${this.product.name}`;
            this.tags = this.product.tags;
            this.name = this.product.name;
            this.url = this.product.url;
            this.images = this.product.get('images');
            this.approved = this.product.approved;
            this.editing = false;
          } catch (e) {
            this.$router.push({ name: 'search' });
          }
        }
      },
    },

    pageState: {
      immediate: true,
      handler() {
        if (this.pageState === 'submit') {
          const newState = DEFAULT_STATE();
          Object.keys(newState).forEach((key) => { this[key] = newState[key]; });
          this.editing = true;
        }
      },
    },
  },

  methods: {
    handleFlag() {
      this.$modal.show(
        FlagModal,
        { product: this.product },
        { width: 400, height: 'auto', classes: 'flag-modal' },
      );
    },

    async handleApprove() {
      if (!this.saving) {
        this.saving = true;
        try {
          if (!this.product.approved) {
            this.product.approved = true;
          } else {
            this.product.approved = false;
          }
          await this.product.save();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        this.approved = this.product.approved;
        this.saving = false;
      }
    },

    handleEdit() {
      this.editing = true;
    },

    handleCancel() {
      this.editing = false;
      if (this.pageState === 'submit') {
        this.$router.push({ name: 'search' });
      } else {
        this.name = this.product.name;
        this.tags = this.product.tags;
        this.url = this.product.url;
        this.images = this.product.images;
      }
    },

    async handleSave() {
      if (this.saveable) {
        this.saving = true;
        try {
          this.product.name = this.name;
          this.product.tags = this.tags;
          this.product.url = this.url;
          this.product.images = this.images;
          this.product.submittedBy = User.current();
          const thumbnail = await utils.thumbnailify(this.images[0].url());
          const parseFile = new this.$parse.File('thumb.webp', thumbnail);
          await parseFile.save();
          this.product.thumbnail = parseFile;
          this.product.save()
            .then(() => {
              this.editing = false;
              if (!this.id) {
                this.$router.push({ name: 'product', params: { id: this.product.id } });
              }
            })
            // eslint-disable-next-line no-alert
            .catch((e) => alert(e.message))
            .finally(() => {
              this.saving = false;
            });
        } catch (e) {
          // eslint-disable-next-line no-alert
          alert(e.message);
          this.saving = false;
        }
      }
    },

    async handleDelete() {
      if (this.isAdmin) {
        // eslint-disable-next-line no-restricted-globals, no-alert
        if (confirm(`Are you sure you want to delete "${this.product.name}"`)) {
          this.product.destroy()
            .then(() => this.$router.push({ name: 'search' }))
            // eslint-disable-next-line no-alert
            .catch((e) => alert(e.message));
        }
      }
    },
  },

  render() {
    return (
      <AppFrame>
        <TagList
          slot="left"
          selectedTags={this.tags}
          onChange={(tags) => { this.tags = tags; }}
          disabled={!this.editing}
        />

        <div class={{
          'product-container': true,
          editing: this.editing,
        }}>
          <ProductTitle
            class="product-title"
            editing={this.editing}
            title={this.name}
            onChange={(name) => { this.name = name; }}
          />
          <ProductUrl
            class="product-url"
            editing={this.editing}
            url={this.url}
            onChange={(url) => { this.url = url; }}
          />

          <div class="buttons">
            <Button
              class={{
                'save-button': true,
                hide: !this.editable || !this.editing,
              }}
              onClick={this.handleSave}
              disabled={!this.saveable}
              label="Save"
              size="medium"
            />
            <Button
              class={{
                'cancel-button': true,
                hide: !this.editable || !this.editing,
              }}
              onClick={this.handleCancel}
              label="Cancel"
              size="medium"
            />
            <Button
              class={{
                'edit-button': true,
                hide: !this.editable || this.editing,
              }}
              onClick={this.handleEdit}
              label="Edit"
              size="medium"
            />
            <Button
              class={{
                'approve-button': true,
                hide: this.editing || !this.isPrivileged,
              }}
              onClick={this.handleApprove}
              label={this.approved ? 'Reject' : 'Approve'}
              size="medium"
              color="red"
            />
            <Button
              class={{
                'flag-button': true,
                hide: !(this.loggedIn && !this.editing && !this.isPrivileged),
              }}
              onClick={this.handleFlag}
              label="Flag"
              size="medium"
              color="red"
            />
          </div>

          <TagInput
            class="product-tags"
            // eslint-disable-next-line no-nested-ternary
            placeholder={this.editing ? 'Add tags...' : (this.tags.length === 0 ? 'No tags' : '')}
            tags={this.tags}
            onChange={(tags) => { this.tags = tags; }}
            disabled={!this.editing}
          />

          <ProductImages
            class="product-images"
            editing={this.editing}
            images={this.images}
            onChange={(images) => { this.images = [...images]; }}
          />
        </div>
        <Button
          class={{
            'delete-button': true,
            hide: !(this.isAdmin && this.editing && this.$route.name !== 'submit'),
          }}
          onClick={this.handleDelete}
          label={'Delete'}
          size="fit medium"
          color="red"
        />
      </AppFrame>
    );
  },
};
</script>

<style scoped>
.product-container {
  display: grid;
  grid-template-areas:
    "title title"
    "url buttons"
    "tags tags"
    "image image";
  grid-template-columns: 1fr min-content;
  grid-auto-rows: min-content;
  column-gap: 10px;
}

.product-title {
  grid-area: title;
}

  .editing .product-title {
    margin-bottom: 20px;
  }

.product-url {
  grid-area: url;
}

.product-tags {
  grid-area: tags;
  margin: 20px 0;
}

.product-images {
  grid-area: image;
}

.buttons {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

  .buttons > * {
    margin-left: 10px;
    white-space: nowrap;
  }

  .buttons > *:first-child {
    margin-left: 0;
  }

.delete-button {
  margin-top: 80px;
  width: 100%;
}

@media (max-width: 1000px) {
  .product-container {
    grid-template-areas:
      "title title"
      "url buttons"
      "tags tags"
      "image image";
    grid-template-columns: 1fr min-content;
    align-content: center;
  }
}
</style>
