<template>
  <div class="loader-wrapper">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
  .loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: inherit;
    z-index: 1030;
    font-size: 3rem;
  }

  .loader {
    left: 50%;
    margin-left: -4rem;
    font-size: 10px;
    border: .8rem solid #dcdcdc;
    border-left: .8rem solid #5983e8;
    animation: spin 1s infinite linear;
  }
  .loader, .loader:after {
      border-radius: 50%;
      width: 8rem;
      height: 8rem;
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -4.05rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
