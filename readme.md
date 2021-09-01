# Vue Cookie Notice

A simple vue component to accept/reject cookies.

# Installation

```shell
yarn add maya-vue-cookie-notice
```

or

```shell
npm install --save maya-vue-cookie-notice
```

# Usage

First, you'll want to extend `CookieNotice.vue'.

```
// MyCookieNotice.vue
<script>
import CookieNotice from 'maya-vue-cookie-notice';

export default {
  extends: CookieNotice,

  methods: {
    handleAccepted() {
      if (document.querySelector('[src^="https://example.com/script.js"]')) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://example.com/script.js';
        document.body.append(script);
      }
    },

    handleRejected () {
      document.getElementById('myThingToRemove').remove();
    },
  }
}
</script>
```

# Props

- wrapper-class
- btn-wrapper-class
- accept-btn-class
- accept-btn-text
- reject-btn-class
- reject-btn-text
- cookie-name
- reset-selector
- body-accepted-class
- body-rejected-class

# Events

- accept
- reject
