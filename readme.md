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

You'll want to extend `maya-vue-cookie-notice' and override whichever handle methods you need.

```vue
<script>
import CookieNotice from 'maya-vue-cookie-notice';

export default {
  extends: CookieNotice,

  methods: {
    handleAcceptedPreference() {
      if (document.querySelector('[src^="https://example.com/script.js"]')) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://example.com/script.js';
        document.body.append(script);
      }
    },

    handleRejectedPreference () {
      document.getElementById('myThingToRemove').remove();
    },

    handleAcceptedStatistic() {
      // Statistics cookies were accepted
    },

    handleRejectedStatistic() {
      // Statistics cookies were rejected
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
import CookieNotice from './my-vue-files/CookieNotice.vue';

new Vue({
  el: '#app',

  components: {
    CookieNotice,
  },
});
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
