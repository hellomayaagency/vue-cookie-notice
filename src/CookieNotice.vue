<template>
  <div :class="wrapperClass" v-if="show">
    <div v-if="showOptions">
      <div>
        <slot name="options-text" />
      </div>

      <div>
        <label :class="labelClass">
          <input type="checkbox" checked disabled />
          Required cookies
        </label>
        <slot name="required-cookies-description" />
      </div>

      <div v-if="preferenceCookies">
        <label :class="labelClass">
          <input type="checkbox" v-model="cookieValue.preferenceCookies" />
          Allow preference cookies
        </label>
        <slot name="preference-cookies-description" />
      </div>

      <div v-if="statisticCookies">
        <label :class="labelClass">
          <input type="checkbox" v-model="cookieValue.statisticCookies" />
          Allow statistics cookies
        </label>
        <slot name="statistics-cookies-description" />
      </div>

      <div v-if="marketingCookies">
        <label :class="labelClass">
          <input type="checkbox" v-model="cookieValue.marketingCookies" />
          Allow marketing cookies
        </label>
        <slot name="marketing-cookies-description" />
      </div>
    </div>

    <slot v-else />

    <div :class="btnWrapperClass">
      <template v-if="showOptions">
        <button @click.prevent="rejectAll" :class="rejectBtnClass">{{ rejectBtnText }}</button>
        <button @click.prevent="saveOptions" :class="saveBtnClass">{{ saveBtnText }}</button>
      </template>
      <button v-else @click.prevent="showOptions = !showOptions" :class="optionsBtnClass">
        {{ optionsBtnText }}
      </button>
      <button type="button" @click.prevent="userAcceptAll" :class="acceptBtnClass">
        {{ acceptBtnText }}
      </button>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      show: false,
      showOptions: false,
      consentImplied: false,
      cookieSet: false,
      cookieValue: {
        preferenceCookies: true,
        statisticCookies: true,
        marketingCookies: true,
      },
    };
  },

  props: {
    preferenceCookies: {
      type: Boolean,
      default: true,
    },
    statisticCookies: {
      type: Boolean,
      default: true,
    },
    marketingCookies: {
      type: Boolean,
      default: true,
    },
    labelClass: {
      type: String,
      default: 'font-bold',
    },
    wrapperClass: {
      type: String,
      default: 'fixed right-5 bottom-5 rounded bg-white shadow z-50 p-5 max-w-sm text-black',
    },
    btnWrapperClass: {
      type: String,
      default: 'flex gap-2.5 mt-3',
    },
    acceptBtnClass: {
      type: String,
      default: 'flex-1 rounded bg-black text-white px-5 py-2.5',
    },
    acceptBtnText: {
      type: String,
      default: 'Accept',
    },
    rejectBtnClass: {
      type: String,
      default: 'flex-1 rounded border-2 border-black px-5 py-2.5 text-black',
    },
    rejectBtnText: {
      type: String,
      default: 'Reject',
    },
    optionsBtnClass: {
      type: String,
      default: 'flex-1 rounded border-2 border-black px-5 py-2.5 text-black',
    },
    optionsBtnText: {
      type: String,
      default: 'Options',
    },
    saveBtnClass: {
      type: String,
      default: 'flex-1 rounded border-2 border-black px-5 py-2.5 text-black',
    },
    saveBtnText: {
      type: String,
      default: 'Save',
    },
    cookieName: {
      type: String,
      default: 'cookie-consent',
    },
    resetSelector: {
      type: String,
      default: '.show-cookie-notice',
    },
    bodyPreferenceAcceptedClass: {
      type: String,
      default: 'preference-cookies-accepted',
    },
    bodyPreferenceRejectedClass: {
      type: String,
      default: 'preference-cookies-rejected',
    },
    bodyStatisticAcceptedClass: {
      type: String,
      default: 'statistic-cookies-accepted',
    },
    bodyStatisticRejectedClass: {
      type: String,
      default: 'statistic-cookies-rejected',
    },
    bodyMarketingAcceptedClass: {
      type: String,
      default: 'marketing-cookies-accepted',
    },
    bodyMarketingRejectedClass: {
      type: String,
      default: 'marketing-cookies-rejected',
    },
  },

  created() {
    this.getCookie();

    document.body.addEventListener('click', (event) => {
      if (event.target.matches(this.resetSelector)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.removeCookie();
        this.showDialog();
      }
    });

    if (!this.cookieSet) {
      this.showDialog();
      window.addEventListener('scroll', this.implicitConsent);
      return;
    }

    this.handleChoices();
  },

  methods: {
    implicitConsent() {
      this.handleAcceptedPreferenceAll();
      this.handleAcceptedStatisticAll();
      this.handleAcceptedMarketingAll();
      window.removeEventListener('scroll', this.implicitConsent);
    },

    handleChoices() {
      if (this.cookieValue.preferenceCookies) {
        this.handleAcceptedPreferenceAll();
      } else {
        this.handleRejectedPreferenceAll();
      }

      if (this.cookieValue.statisticCookies) {
        this.handleAcceptedStatisticAll();
      } else {
        this.handleRejectedStatisticAll();
      }

      if (this.cookieValue.marketingCookies) {
        this.handleAcceptedMarketingAll();
      } else {
        this.handleRejectedMarketingAll();
      }
    },

    userAcceptAll() {
      this.setCookie();
      this.handleAcceptedPreferenceAll();
      this.handleAcceptedStatisticAll();
      this.handleAcceptedMarketingAll();
      this.hideDialog();
    },

    rejectAll() {
      this.setCookie('');
    },

    handleAcceptedPreferenceAll() {
      this.cookieValue.preferenceCookies = true;
      document.body.classList.remove(this.bodyPreferenceRejectedClass);
      document.body.classList.add(this.bodyPreferenceAcceptedClass);
      this.handleAcceptedPreference();
      this.$emit('preferencecookiesaccepted');
      const event = new CustomEvent('preferencecookiesaccepted');
      document.body.dispatchEvent(event);
    },

    handleAcceptedPreference() {
      // Extend this to implement your own logic
      // when preference cookies are accepted
    },

    handleAcceptedStatisticAll() {
      this.cookieValue.statisticCookies = true;
      document.body.classList.remove(this.bodyStatisticRejectedClass);
      document.body.classList.add(this.bodyStatisticAcceptedClass);
      this.handleAcceptedStatistic();
      this.$emit('statisticcookiesaccepted');
      const event = new CustomEvent('statisticcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    handleAcceptedStatistic() {
      // Extend this to implement your own logic
      // when statistic cookies are accepted
    },

    handleAcceptedMarketingAll() {
      this.cookieValue.marketingCookies = true;
      document.body.classList.remove(this.bodyMarketingRejectedClass);
      document.body.classList.add(this.bodyMarketingAcceptedClass);
      this.handleAcceptedMarketing();
      this.$emit('marketingcookiesaccepted');
      const event = new CustomEvent('marketingcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    handleAcceptedMarketing() {
      // Extend this to implement your own logic
      // when marketing cookies are accepted
    },

    userRejects() {
      this.setCookie('deny');
      this.handleRejectedAll();
      this.hideDialog();
    },

    handleRejectedPreferenceAll() {
      this.cookieValue.preferenceCookies = false;
      document.body.classList.remove(this.bodyPreferenceAcceptedClass);
      document.body.classList.add(this.bodyPreferenceRejectedClass);
      this.handleRejectedPreference();
      this.$emit('preferencecookiesrejected');
      const event = new CustomEvent('preferencecookiesaccepted');
      document.body.dispatchEvent(event);
    },

    handleRejectedPreference() {
      // Extend this to implement your own logic
      // when preference cookies are rejected
    },

    handleRejectedStatisticAll() {
      this.cookieValue.statisticCookies = false;
      document.body.classList.remove(this.bodyStatisticAcceptedClass);
      document.body.classList.add(this.bodyStatisticRejectedClass);
      this.handleRejectedStatistic();
      this.$emit('statisticcookiesrejected');
      const event = new CustomEvent('statisticcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    handleRejectedStatistic() {
      // Extend this to implement your own logic
      // when statistic cookies are rejected
    },

    handleRejectedMarketingAll() {
      this.cookieValue.marketingCookies = false;
      document.body.classList.remove(this.bodyMarketingAcceptedClass);
      document.body.classList.add(this.bodyMarketingRejectedClass);
      this.handleRejectedMarketing();
      this.$emit('marketingcookiesrejected');
      const event = new CustomEvent('marketingcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    handleRejectedMarketing() {
      // Extend this to implement your own logic
      // when marketing cookies are rejected
    },

    setCookie() {
      Cookies.set(this.cookieName, JSON.stringify(this.cookieValue));
      this.cookieSet = true;
    },

    getCookie() {
      let value = Cookies.get(this.cookieName);

      try {
        value = JSON.parse(value);
        this.cookieSet = true;
        this.cookieValue.preferenceCookies = value.preferenceCookies;
        this.cookieValue.statisticCookies = value.statisticCookies;
        this.cookieValue.marketingCookies = value.marketingCookies;
      } catch (e) {
        this.cookieSet = false;
      }

      return this.cookieValue;
    },

    removeCookie() {
      Cookies.remove(this.cookieName);
    },

    saveOptions() {
      this.handleChoices();
      this.setCookie();
      this.hideDialog();
    },

    showDialog() {
      this.removeCookie();
      this.showDialog();
    },

    showDialog() {
      this.show = true;
    },

    hideDialog() {
      this.show = false;
    },
  },
};
</script>
