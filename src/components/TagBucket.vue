<script>
export default {
  name: 'TagBucket',

  render() {
    return (
      <div class="tag-bucket">
        {this.$slots.default}
      </div>
    );
  },
};
</script>

<style scoped>
.tag-bucket {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-right: -5px;
  margin-bottom: -5px;
}

  .tag-bucket > * {
    margin-right: 5px;
    margin-bottom: 5px;
  }
</style>
