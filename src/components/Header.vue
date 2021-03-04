<script>
import { mapState } from 'vuex';

export default {
  name: 'Header',

  data() {
    return {
      hasLoadedArt: false,
    };
  },

  computed: {
    ...mapState({
      tagline: (state) => state.tagline,
      keyboardArtSrc: (state) => state.keyboardArt.src,
      keyboardArtName: (state) => state.keyboardArt.name,
      keyboardArtAttribution: (state) => state.keyboardArt.attribution,
      keyboardArtUrl: (state) => state.keyboardArt.url,
    }),
  },

  methods: {
    handleHeaderClick() {
      if (this.$route.name !== 'search') {
        this.$router.push({ name: 'search' });
      } else {
        this.$emit('click');
        // const coinFlip = Math.floor(Math.random() * 2) === 0;
        // if (coinFlip) {
        //   this.$store.dispatch('getTagline');
        // } else {
        //   this.$store.dispatch('getKeyboardArt');
        // }
      }
    },
  },

  render() {
    return (
      <div class="header">
        <div class="logo" onClick={this.handleHeaderClick}>
          Keebhunter
        </div>
        <div class="tagline">
          {this.tagline}
        </div>
        <img
          class={{
            'keyboard-art': true,
            show: this.hasLoadedArt,
          }}
          onLoad={() => { this.hasLoadedArt = true; }}
          src={this.keyboardArtSrc}
          title={`${this.keyboardArtName}.\nCredit to ${this.keyboardArtAttribution}, inspired by sealcouch.`}
          alt={`${this.keyboardArtName}.\nCredit to ${this.keyboardArtAttribution}, inspired by sealcouch.`}
        />
      </div>
    );
  },
};
</script>

<style scoped>
.header {
  display: grid;
  grid-template-areas:
    "logo keyboard"
    "tagline keyboard";
  grid-template-rows: min-content 1em;
  grid-template-columns: min-content auto;
  column-gap: 20px;
  user-select: none;
}

  .logo {
    grid-area: logo;
    font-size: 2em;
    align-self: flex-end;
    white-space: nowrap;
    cursor: pointer;
  }

  .tagline {
    grid-area: tagline;
    font-size: 1em;
    font-family: serif;
    font-style: italic;
    align-self: flex-start;
    white-space: nowrap;
  }

  .keyboard-art {
    grid-area: keyboard;
    max-height: 50px;
    align-self: center;
    justify-self: right;
    display: none;
  }

    .keyboard-art.show {
      display: unset;
    }
</style>
