# react-gridstack
React wrapper for gridstack

This wrapper is build for an implementation of gridstack with react.

# Issues with current version of gridstack.js
The current version of gridstack.js contains a small issue with dropping an item to another stack. This is fixed on the repository `WebMaid/gridstack.js` and might be fixed in future gridstack.js updates.

# Usage of portals to store state of items
With the current implementation of portals we tried to allow items to preserve their state when beeing dropped to another stack. The current implementation works, but is not recomended for production use. Their I would suggest using a global state store, where you store those things.
