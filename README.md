# keebhunter

## TODO
### Polish
- Loading states
- Handle >100 tags better (right now just fetching 200 to be safe)
  - add a "tag popularity" metric powered by a cloud job
    - `Tag.popularity` = `Query(Products).contains('tags', Tag).count()`
  - `<TagList>` only shows maybe the top 5 tags per category
    - potential click to "show more" and get the next 5?
  - fetch tags for product results / product page
  - any tags entered into the `<TagInput>` should be included in the `<TagList>` if they aren't already
- Move `utils.thumbnailify` (and possibly `utils.compress`) server-side
- Product editing/submitting experience
  - Handle saving failures more gracefully
  - Add failure states for image upload
  - Drag and drop to reorder doesn't work on mobile
  - Some more general styling improvements
- Lack of flex `gap` support on iOS and Safari for `<TagInput>`

### Feature Roadmap
- Sorting option on search
  - by popularity, recency, relevance (# of tags overlapping), etc.
- Add original price/MSRP field?
- Ratings?

## Development
```
yarn install
yarn run serve
```