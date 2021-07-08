<template>
  <div class="mw-big-logo-wrapper">
    <div class="big-logo-store"></div>
  </div>

  <div>
    <span class="love-link"
    title="Made with love by fans"
    target="_blank">
      <i class="fas fa-heart love"></i>
    </span>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  $fa-font-path: '../../assets/fonts' !default;
  @import '~@fortawesome/fontawesome-free/scss/regular.scss';
  @import '~@fortawesome/fontawesome-free/scss/solid.scss';
  @import '~@fortawesome/fontawesome-free/scss/fontawesome.scss';

  .mw-big-logo-wrapper {
    position: relative;
    text-align: center;

    .big-logo-store {
      width: 150px;
      height: 150px;
      background: url('../../assets/logo_500.png') no-repeat;
      background-size: contain;
    }

    .mw-short-description {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
      background: #ffffff;
      font-family: 'Roboto Condensed', sans-serif;
      padding: 5px;
    }
  }

  .love {
    -webkit-transition: love 0.3s ease-in-out;
    -moz-transition: love  0.3s ease-in-out;
    transition: love 0.3s ease-in-out;
  }

  .love:hover {
    -webkit-transform: scale(.9);
    -moz-transform: scale(.9);
    transform: scale(.9);
    display: inline-block;

    -webkit-animation: love .5s infinite linear alternate-reverse;
    -moz-animation: love .5s infinite linear alternate-reverse;
    animation: love .5s infinite linear alternate-reverse;
  }

  .love-link {
    text-align: center;
    width: 100%;
    display: block;
    outline: 0;
    color: red;
  }


  @-webkit-keyframes love {
    to {
      -webkit-transform: scale(1.2);
    }
  }

  @-moz-keyframes love {
    to {
      -moz-transform: scale(1.2);
    }
  }

  @keyframes love {
    to {
      transform: scale(1.2);
    }
  }
</style>