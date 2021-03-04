<script>
import TagChip from '@/components/TagChip.vue';
import TagBucket from '@/components/TagBucket.vue';

export default {
  name: 'ProductResult',

  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  render() {
    return (
      <router-link
        class="product-result"
        to={{ name: 'product', params: { id: this.product.id } }}
      >
        <img
          class={{
            'result-image': true,
            placeholder: !this.product.thumbnail,
          }}
          src={this.product.thumbnail ? this.product.thumbnail.url() : '/img-placeholder.png'}
        />
        <div class="result-name">
          {this.product.name} {!this.product.approved ? (<span class="approval">[ NOT APPROVED ]</span>) : null}
        </div>
        <TagBucket class="result-tags">
          {this.product.tags.map((tag) => (
            <TagChip
              tag={tag}
              onClick={(e) => { e.preventDefault(); this.$emit('click', tag); }}
            />
          ))}
        </TagBucket>
      </router-link>
    );
  },
};
</script>

<style scoped>
.product-result {
  display: grid;
  grid-template-areas:
    "name name"
    "image tags";
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  background-color: var(--search__result-background);
  border-radius: 5px;
  padding: 10px;
  column-gap: 10px;
  row-gap: 10px;
  cursor: pointer;
  text-decoration: none;
}

  .result-image {
    grid-area: image;
    max-height: 80px;
    width: 100px;
    object-fit: contain;
    object-position: center center;
    border-radius: 4px;
  }

    .result-image.placeholder {
      object-fit: cover;
      object-position: center 67%;
      opacity: .2;
      filter: contrast(.8);
    }

  .result-name {
    grid-area: name;
    color: var(--search__result-name-color);
    text-decoration: none;
    font-size: 1.25em;
  }

    .product-result:hover .result-name {
      color: var(--search__result-name-hover-color);
    }

    .result-name .approval {
      color: var(--red);
      font-size: .75em;
      vertical-align: middle;
    }

  .result-tags {
    grid-area: tags;
  }
</style>
