# Vue Cookie Notice

A simple vue component to accept/reject cookies.

## Note

V3.0.0 introduces TypeScript and Vue3 support. If you need Vue 2 support, use v2.x.x.

# Installation

```shell
yarn add maya-cookie-notice-vue
```

or

```shell
npm install --save maya-cookie-notice-vue
```

# Usage

You'll want to extend `maya-cookie-notice-vue' and override whichever handle methods you need.

The example below grants consent for analytics storage when statistic cookies are enabled.

```vue
<script lang="ts">
import CookieNotice from 'maya-cookie-notice-vue';

export default {
  extends: CookieNotice,

  methods: {
    handleAcceptedStatistic() {
      if (typeof gtag !== 'undefined' && gtag) {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
          wait_for_update: 500,
          region: ['GB'],
        });
      }
    },
    handleRejectedStatistic() {
      if (typeof gtag !== 'undefined' && gtag) {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
          wait_for_update: 0,
          region: ['GB'],
        });
      }
    },

    handleAcceptedPreference() {
      // Preference cookies were accepted
    },

    handleRejectedPreference () {
      // Preference cookies were rejected
    },

    handleAcceptedMarketing() {
      // Marketing cookies were accepted
    },

    handleRejectedMarketing() {
      // Marketing cookies were rejected
    },
  }
}
</script>
```

Then include your extended version in your app:

```js
import App from './App.vue';
import CookieNotice from './my-vue-files/CookieNotice.vue';

const app = createApp(App);
app.component('cookie-notice', CookieNotice);
app.mount('#app');
```

When the user scrolls down, that will be taken as implied consent **(your text in the default slot should reflect this)**.

The user can then choose to accept all the cookies or use the options button to filter the cookies or reject all of them.

# Props

- preference-cookies
- statistic-cookies
- marketing-cookies
- label-class
- wrapper-class
- btn-wrapper-class
- options-wrapper-class
- options-btn-wrapper-class
- accept-btn-class
- accept-btn-text
- reject-btn-class
- reject-btn-text
- options-btn-class
- options-btn-text
- save-btn-class
- save-btn-text
- cookie-name
- reset-selector
- body-preference-accepted-class
- body-preference-rejected-class
- body-statistic-accepted-class
- body-statistic-rejected-class
- body-marketing-accepted-class
- body-marketing-rejected-class

# Events

The following will both be emited from the component and triggered as events on the `body` element.

- preferencecookiesaccepted
- preferencecookiesrejected
- statisticcookiesaccepted
- statisticcookiesrejected
- marketingcookiesaccepted
- marketingcookiesrejected

# Slots

You can use the following slots to provide extra text.

## Default slot

```html
<cookie-notice>
  We've got cookies
</cookie-notice>
```

## Options Text

```html
<cookie-notice>
  <template v-slot:options-text>
    Please select and accept your tracking preferences:
  </template>
</cookie-notice>
```

## Descriptions

```html
<cookie-notice>
  <template v-slot:required-cookies-description>
    Cookies for basic website functionality. These can't be turned off.
  </template>
  <template v-slot:preference-cookies-description>
    Cookies to store your preferences.
  </template>
  <template v-slot:statistics-cookies-description>
    Cookies to track how our site is being used in order to improve our service.
  </template>
  <template v-slot:marketing-cookies-description>
    Cookies used by us and our advertising partners to provide you with personalised advertising.
  </template>
</cookie-notice>
```

# Development

To compile before distribution, run `./compile`. This will use `vue-compile` to convert the TS to JS.

Note: this does strip out the type information so a better solution should be found.
