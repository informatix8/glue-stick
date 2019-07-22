# Glue Stick

Glue Stick allows to handle many cases which CSS sticky doesn't handle or makes it hard. 
When you have multiple elements which should be sticky it automatically calculates the top position of subsequent elements.

## Features
- Multiple sticky elements stacked together
- Support for responsiveness
- Footer handling
- Pre and post user defined functions can be called during significant events
- Stick to certain element
- Stick inside parent element

## Dependencies

1. Lodash merge function.
2. IntersectionObserver polyfill
3. hc-sticky

## Usage

### Install

```shell
npm install @informatix8/glue-stick --save-dev
```

### CDN

```html
<script src="https://unpkg.com/@informatix8/glue-stick/dist/glue-stick.all.umd.js"></script>
```

### Vanilla Javascript

```javascript
new GlueStick({
    subject: 'aside',
    footer: 'footer'
});
```

## Development

```shell
npm run dev
```

## Build

```shell
npm run build
```

## Release

```shell
npm run build
git tag -a vX.Y.Z
git push origin master
git push origin --tags
npm publish --access=public .
```
