<template>  
    <div :class="wrapperClasses" v-if="show">
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
  
      <div :class="btnWrapperClasses">
        <template v-if="showOptions">
          <button @click.prevent="rejectAll" :class="rejectBtnClass">{{ rejectBtnText }}</button>
          <button @click.prevent="onSaveOptions" :class="saveBtnClass">{{ saveBtnText }}</button>
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
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    preferenceCookies: {
      type: Boolean,
      default: true
    },
    statisticCookies: {
      type: Boolean,
      default: true
    },
    marketingCookies: {
      type: Boolean,
      default: true
    },
    labelClass: {
      type: String,
      default: 'font-bold'
    },
    wrapperClass: {
      type: String,
      default: 'fixed right-5 bottom-5 rounded bg-white shadow z-50 p-5 max-w-sm text-black'
    },
    optionsWrapperClass: {
      type: String,
      default: null
    },
    btnWrapperClass: {
      type: String,
      default: 'flex gap-2.5 mt-3'
    },
    optionsBtnWrapperClass: {
      type: String,
      default: null
    },
    acceptBtnClass: {
      type: String,
      default: 'flex-1 rounded bg-black text-white px-5 py-2.5 whitespace-nowrap'
    },
    acceptBtnText: {
      type: String,
      default: 'Accept'
    },
    rejectBtnClass: {
      type: String,
      default: 'flex-1 rounded border-2 border-black px-5 py-2.5 text-black whitespace-nowrap'
    },
    rejectBtnText: {
      type: String,
      default: 'Reject'
    },
    optionsBtnClass: {
      type: String,
      default: 'flex-1 rounded border-2 border-black px-5 py-2.5 text-black whitespace-nowrap'
    },
    optionsBtnText: {
      type: String,
      default: 'Options'
    },
    saveBtnClass: {
      type: String,
      default: 'flex-1 rounded border-2 border-black px-5 py-2.5 text-black whitespace-nowrap'
    },
    saveBtnText: {
      type: String,
      default: 'Save'
    },
    cookieName: {
      type: String,
      default: 'cookie-consent'
    },
    resetSelector: {
      type: String,
      default: '.show-cookie-notice'
    },
    bodyPreferenceAcceptedClass: {
      type: String,
      default: 'preference-cookies-accepted'
    },
    bodyPreferenceRejectedClass: {
      type: String,
      default: 'preference-cookies-rejected'
    },
    bodyStatisticAcceptedClass: {
      type: String,
      default: 'statistic-cookies-accepted'
    },
    bodyStatisticRejectedClass: {
      type: String,
      default: 'statistic-cookies-rejected'
    },
    bodyMarketingAcceptedClass: {
      type: String,
      default: 'marketing-cookies-accepted'
    },
    bodyMarketingRejectedClass: {
      type: String,
      default: 'marketing-cookies-rejected'
    }
  },

  data() {
    return {
      show: false,
      showOptions: false,
      cookieSet: false,
      cookieValue: {
        preferenceCookies: true,
        statisticCookies: true,
        marketingCookies: true,
        consent: null
      }
    };
  },

  computed: {
    wrapperClasses() {
      if (this.optionsWrapperClass && this.showOptions) {
        return this.optionsWrapperClass;
      }

      return this.wrapperClass;
    },

    btnWrapperClasses() {
      if (this.optionsBtnWrapperClass && this.showOptions) {
        return this.optionsBtnWrapperClass;
      }

      return this.btnWrapperClass;
    }

  },

  created() {
    this.loadCookie();
    document.body.addEventListener('click', event => {
      const target = event.target;

      if (target.matches(this.resetSelector)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.removeCookie();
        this.showDialog();
      }
    });

    if (this.cookieValue.consent !== 'implicit' && this.cookieValue.consent !== 'explicit') {
      window.addEventListener('scroll', this.implicitConsent);
    }

    if (this.cookieValue.consent !== 'explicit') {
      this.showDialog();
    } else {
      this.handleOptions();
    }
  },

  methods: {
    /**
     * User has implied consent by scrolling down the page.
     */
    implicitConsent() {
      this.cookieValue.consent = 'implicit';
      this.handleAcceptedPreferenceAll();
      this.handleAcceptedStatisticAll();
      this.handleAcceptedMarketingAll();
      this.saveCookie();
      window.removeEventListener('scroll', this.implicitConsent);
    },

    /**
     * Take the appropriate actions based on current cookieValue
     */
    handleOptions() {
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

    /**
     * User has explicitly accepted all cookies
     */
    userAcceptAll() {
      this.cookieValue.consent = 'explicit';
      this.handleAcceptedPreferenceAll();
      this.handleAcceptedStatisticAll();
      this.handleAcceptedMarketingAll();
      this.saveCookie();
      this.hideDialog();
    },

    /**
     * User has explicitly rejected all cookies
     */
    rejectAll() {
      this.cookieValue.consent = 'explicit';
      this.handleRejectedPreferenceAll();
      this.handleRejectedStatisticAll();
      this.handleRejectedMarketingAll();
      this.saveCookie();
      this.hideDialog();
    },

    /**
     * Handle the preference cookies being accepted.
     *
     * This will call handleAcceptedPreference in which actions may be taken
     */
    handleAcceptedPreferenceAll() {
      this.cookieValue.preferenceCookies = true;
      document.body.classList.remove(this.bodyPreferenceRejectedClass);
      document.body.classList.add(this.bodyPreferenceAcceptedClass);
      this.handleAcceptedPreference();
      this.$emit('preferencecookiesaccepted');
      const event = new CustomEvent('preferencecookiesaccepted');
      document.body.dispatchEvent(event);
    },

    /**
     * Handle business logic after preference cookes have been accepted
     */
    handleAcceptedPreference() {// Extend this to implement your own logic
    },

    /**
     * Handle the Statistic cookies being accepted.
     *
     * This will call handleAcceptedStatistic in which actions may be taken
     */
    handleAcceptedStatisticAll() {
      this.cookieValue.statisticCookies = true;
      document.body.classList.remove(this.bodyStatisticRejectedClass);
      document.body.classList.add(this.bodyStatisticAcceptedClass);
      this.handleAcceptedStatistic();
      this.$emit('statisticcookiesaccepted');
      const event = new CustomEvent('statisticcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    /**
     * Handle business logic after statistic cookes have been accepted
     */
    handleAcceptedStatistic() {// Extend this to implement your own logic
    },

    /**
     * Handle the Marketing cookies being accepted.
     *
     * This will call handleAcceptedMarketing in which actions may be taken
     */
    handleAcceptedMarketingAll() {
      this.cookieValue.marketingCookies = true;
      document.body.classList.remove(this.bodyMarketingRejectedClass);
      document.body.classList.add(this.bodyMarketingAcceptedClass);
      this.handleAcceptedMarketing();
      this.$emit('marketingcookiesaccepted');
      const event = new CustomEvent('marketingcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    /**
     * Handle business logic after marketing cookes have been accepted
     */
    handleAcceptedMarketing() {// Extend this to implement your own logic
    },

    /**
     * Handle the preference cookies being rejected.
     *
     * This will call handleRejectedPreference in which actions may be taken
     */
    handleRejectedPreferenceAll() {
      this.cookieValue.preferenceCookies = false;
      document.body.classList.remove(this.bodyPreferenceAcceptedClass);
      document.body.classList.add(this.bodyPreferenceRejectedClass);
      this.handleRejectedPreference();
      this.$emit('preferencecookiesrejected');
      const event = new CustomEvent('preferencecookiesaccepted');
      document.body.dispatchEvent(event);
    },

    /**
     * Handle business logic after preference cookes have been rejected
     */
    handleRejectedPreference() {// Extend this to implement your own logic
    },

    /**
     * Handle the Statistic cookies being rejected.
     *
     * This will call handleRejectedStatistic in which actions may be taken
     */
    handleRejectedStatisticAll() {
      this.cookieValue.statisticCookies = false;
      document.body.classList.remove(this.bodyStatisticAcceptedClass);
      document.body.classList.add(this.bodyStatisticRejectedClass);
      this.handleRejectedStatistic();
      this.$emit('statisticcookiesrejected');
      const event = new CustomEvent('statisticcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    /**
     * Handle business logic after statistic cookes have been rejected
     */
    handleRejectedStatistic() {// Extend this to implement your own logic
    },

    /**
     * Handle the Marketing cookies being rejected.
     *
     * This will call handleRejectedMarketing in which actions may be taken
     */
    handleRejectedMarketingAll() {
      this.cookieValue.marketingCookies = false;
      document.body.classList.remove(this.bodyMarketingAcceptedClass);
      document.body.classList.add(this.bodyMarketingRejectedClass);
      this.handleRejectedMarketing();
      this.$emit('marketingcookiesrejected');
      const event = new CustomEvent('marketingcookiesaccepted');
      document.body.dispatchEvent(event);
    },

    /**
     * Handle business logic after marketing cookes have been rejected
     */
    handleRejectedMarketing() {// Extend this to implement your own logic
    },

    /**
     * Store the cookieValue in the browser's cookies
     */
    saveCookie() {
      Cookies.set(this.cookieName, JSON.stringify(this.cookieValue));
      this.cookieSet = true;
    },

    /**
     * Get cookieValue from the browser's cookies
     */
    loadCookie() {
      const str_value = Cookies.get(this.cookieName);

      if (!str_value) {
        this.cookieSet = false;
        return;
      }

      try {
        const value = JSON.parse(str_value);
        this.cookieSet = true;
        this.cookieValue.preferenceCookies = value.preferenceCookies;
        this.cookieValue.statisticCookies = value.statisticCookies;
        this.cookieValue.marketingCookies = value.marketingCookies;
        this.cookieValue.consent = value.consent;
      } catch (e) {
        this.cookieSet = false;
      }
    },

    /**
     * Remove the cookieValue from the browser's cookies
     *
     * This will cause the CookieNotice to be shown on next page load
     */
    removeCookie() {
      Cookies.remove(this.cookieName);
    },

    /**
     * Handle clicking the save button on the dialog
     */
    onSaveOptions() {
      this.handleOptions();
      this.saveCookie();
      this.hideDialog();
    },

    /**
     * Show the dialog
     */
    showDialog() {
      console.log('show!');
      this.show = true;
      console.log(this.show);
    },

    /**
     * Hide the dialog
     */
    hideDialog() {
      console.log('HIDE');
      this.show = false;
    }

  }
});
</script>