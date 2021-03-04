# keebhunter

## TODO
### Polish
- Loading states #1
- Handle >100 tags better (right now just fetching 200 to be safe) #2
- Move `utils.thumbnailify` (and possibly `utils.compress`) server-side #3
- Product editing/submitting experience
  - Handle saving failures more gracefully
  - Add failure states for image upload
  - Drag and drop to reorder doesn't work on mobile
  - Some more general styling improvements
- Lack of flex `gap` support on iOS and Safari for `<TagInput>` #4

### Feature Roadmap
- Sorting option on search
  - by popularity, recency, relevance (# of tags overlapping), etc.
- Continuous-value tags
  - Original price/MSRP
  - Actuation force
  - Search bounds to support these
- Ratings?
- NOT filters to exclude specific tags in searches

## Development
```
yarn install
yarn run serve
```