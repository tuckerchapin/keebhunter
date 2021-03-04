<script>
import utils from '@/lib/utils';

export default {
  name: 'ProductImages',

  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      imageArray: [],
      uploaded: [],
      isDraggingOver: false,
    };
  },

  computed: {
    allUploaded() {
      return this.imageArray.every((image) => image.progress === 1);
    },

    changeable() {
      return this.editing && this.allUploaded;
    },
  },

  watch: {
    images: {
      immediate: true,
      handler() {
        this.imageArray = this.images.map((image) => ({
          url: image.url(),
          progress: 1,
          completed: true,
        }));
        this.uploaded = [];
      },
    },

    uploaded() {
      if (this.allUploaded && this.uploaded.length > 0) {
        this.$emit('change', [...this.images, ...this.uploaded]);
      }
    },
  },

  methods: {
    async handleFileUpload(fileList) {
      if (fileList.length > 0) {
        const files = Array.from(fileList);
        this.clearFileInput();
        const parseFiles = files.map(async (file) => {
          const dataUrl = await this.getDataUrl(file);
          const info = { progress: 0, url: dataUrl };
          this.imageArray.push(info);
          const extension = file.name.split('.').pop();
          const name = `image.${extension}`;
          const compressed = await utils.compress(file, extension);
          const parseFile = new this.$parse.File(name, compressed);
          return parseFile.save({
            progress: (progressValue, loaded, total, { type }) => {
              if (type === 'upload' && progressValue !== null) {
                this.$set(info, 'progress', progressValue);
              }
            },
          });
        });
        this.uploaded.push(...(await Promise.all(parseFiles)));
      }
    },

    clearFileInput() {
      this.$refs.fileInput.value = null;
    },

    getDataUrl(file) {
      const fr = new FileReader();
      return new Promise((resolve, reject) => {
        fr.readAsDataURL(file);
        fr.onload = () => {
          resolve(fr.result);
        };
        fr.onerror = (error) => reject(error);
      });
    },

    remove(index) {
      if (this.changeable) {
        const newImages = [...this.images];
        newImages.splice(index, 1);
        this.$emit('change', newImages);
      }
    },

    reorder(oldIndex, newIndex) {
      if (oldIndex !== newIndex) {
        const newImages = [...this.images];
        newImages.splice(newIndex, 0, ...newImages.splice(oldIndex, 1));
        this.$emit('change', newImages);
      }
    },
  },

  render() {
    if (!this.editing) {
      return (
        <div class="images-container display">
          {this.images.map((image) => (
            <img
              class="image"
              src={image.url()}
              draggable={false}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        class="images-container editing"
      >
        <label
          class="image-upload"
          for="image-file-input"
          onDragover={(e) => e.preventDefault()}
          onDragenter={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
              this.handleFileUpload(e.dataTransfer.files);
            }
          }}
        >
          <div class="upload-prompt">Click to upload</div>
          <div>or</div>
          <div>Drag files here</div>
        </label>
        {this.imageArray.map((image, i) => (
          <div
            id={i}
            class={{
              'image-container': true,
              draggable: this.changeable,
            }}
            draggable={this.changeable}
            onDragstart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', e.target.id);
            }}
            onDragover={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              this.reorder(e.dataTransfer.getData('text/plain'), i);
            }}
          >
            <img
              class="image"
              src={image.url}
              draggable={false}
            />
            <div
              class={{
                'remove-button': true,
                disabled: !this.changeable,
              }}
              onClick={() => this.remove(i)}
            >
              ✕
            </div>
            <div class={{
              'progress-bar-container': true,
              hide: image.progress === 1,
            }}>
              <div class="progress-background">
                Uploading... ({(image.progress * 100).toFixed()}%)
              </div>
              <div class="progress" style={`width: ${image.progress * 100}%`}>
                Uploading... ({(image.progress * 100).toFixed()}%)
              </div>
            </div>
          </div>
        ))}
        <input
          id="image-file-input"
          ref="fileInput"
          class="file-input"
          onChange={(e) => this.handleFileUpload(e.target.files)}
          type="file"
          accept="image/*"
          multiple
        />
      </div>
    );
  },
};
</script>

<!-- editing styles -->
<style scoped>
.images-container.editing {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-gap: 10px;
}

.editing .image-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  position: relative;
  place-items: center;
  border: 1px solid var(--image-upload__not-draggable-border);
  border-radius: 4px;
  user-select: none;
  overflow: hidden;
}

  .editing .image-container.draggable {
    border-color: var(--image-upload__border);
    cursor: grab;
  }

.editing .image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.file-input {
  display: none;
}

.image-upload {
  display: grid;
  border: 1px solid var(--image-upload__not-draggable-border);
  border-radius: 4px;
  place-items: center;
  align-content: center;
  background-color: var(--image-upload__input-background-disabled);
  color: var(--image-upload__input-color-disabled);
  border-color: var(--image-upload__input-border-disabled);
  opacity: 0.5;
  user-select: none;
}

  .image-upload:not(.disabled) {
    cursor: pointer;
    background-color: var(--image-upload__input-background);
    color: var(--image-upload__input-color);
    border-color: var(--image-upload__border);
    opacity: 1;
    border-style: dashed;
  }

.remove-button {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--image-upload__remove-color-disabled);
  font-size: 1.5em;
  line-height: 1em;
  padding: 5px;
}

  .remove-button:not(.disabled) {
    color: var(--image-upload__remove-color);
    cursor: pointer;
  }

.progress-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  white-space: nowrap;
}

  .progress,
  .progress-background {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px;
    font-size: .75em;
    text-transform: uppercase;
  }

  .progress {
    width: 0px;
    background-color: var(--image-progress__active-background);
    color: var(--image-progress__active-color);
    transition: width 0.2s;
  }

  .progress-background {
    width: calc(100% - 2 * 10px);
    background-color: var(--image-progress__background-background);
    color: var(--image-progress__background-color);
  }
</style>

<!-- normal display styles -->
<style scoped>
.images-container.display {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  justify-items: center;
  row-gap: 20px;
}

.display .image {
  max-width: 100%;
  border-radius: 4px;
}
</style>
