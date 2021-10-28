<template>
  <div :class="wrapperClass" v-if="show">
    <slot />

    <div :class="btnWrapperClass">
      <button type="button" @click.prevent="userAccept" :class="acceptBtnClass">
        {{ acceptBtnText }}
      </button>
      <button type="button" @click.prevent="userRejects" :class="rejectBtnClass">
        {{ rejectBtnText }}
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
    };
  },

  props: {
    wrapperClass: {
      type: String,
      default: 'fixed right-5 bottom-5 rounded bg-white shadow z-50 p-5 max-w-sm',
    },
    btnWrapperClass: {
      type: String,
      default: 'grid grid-cols-2 gap-2.5',
    },
    acceptBtnClass: {
      type: String,
      default: 'rounded bg-black text-white px-5 py-2.5',
    },
    acceptBtnText: {
      type: String,
      default: 'Accept',
    },
    rejectBtnClass: {
      type: String,
      default: 'rounded border-2 border-black px-5 py-2.5',
    },
    rejectBtnText: {
      type: String,
      default: 'Reject',
    },
    cookieName: {
      type: String,
      default: 'cookie-consent',
    },
    resetSelector: {
      type: String,
      default: '.show-cookie-notice',
    },
    bodyAcceptedClass: {
      type: String,
      default: 'cookies-accepted',
    },
    bodyRejectedClass: {
      type: String,
      default: 'cookies-rejected',
    },
  },

  created() {
    const cookie = this.getCookie();

    document.body.addEventListener('click', (event) => {
      if (event.target.matches(this.resetSelector)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.removeCookie();
        this.showDialog();
      }
    });

    if (!cookie) {
      this.showDialog();
      return;
    }

    if (cookie === 'allow') {
      this.handleAcceptedAll();
    } else {
      this.handleRejectedAll();
    }
  },

  methods: {
    userAccept() {
      this.setCookie('allow');
      this.handleAcceptedAll();
      this.hideDialog();
    },

    handleAcceptedAll() {
      document.body.classList.remove(this.bodyRejectedClass);
      document.body.classList.add(this.bodyAcceptedClass);
      this.handleAccepted();
      this.$emit('accept');
      const event = new CustomEvent('cookies-accepted');
      document.body.dispatchEvent(event);
    },

    handleAccepted() {
      // Extend this to implement your own logic when cookies are accepted
    },

    userRejects() {
      this.setCookie('deny');
      this.handleRejectedAll();
      this.hideDialog();
    },

    handleRejectedAll() {
      document.body.classList.remove(this.bodyAcceptedClass);
      document.body.classList.add(this.bodyRejectedClass);
      this.handleRejected();
      this.$emit('reject');
      const event = new CustomEvent('cookies-accepted');
      document.body.dispatchEvent(event);
    },

    handleRejected() {
      // Extend this to implement your own logic when cookies are rejected
    },

    setCookie(value) {
      Cookies.set(this.cookieName, value);
    },

    getCookie() {
      return Cookies.get(this.cookieName);
    },

    removeCookie() {
      Cookies.remove(this.cookieName);
    },

    hasAccepted() {
      return Cookies.get(this.cookieName) === 'allow';
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
