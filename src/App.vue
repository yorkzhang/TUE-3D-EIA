<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang='less'>
@import "@/my-theme/config.less";
html,
body {
  margin: 0;
  padding: 0;
  background-color: @page_bj !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
/* 更改滚动条默认样式start */
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background: rgba(64, 79, 93, 1);
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.3);
  border-radius: 2.5px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.3);
  border-radius: 2.5px;
  /* background: rgba(26, 86, 116, 0.7); */
  background-color: rgba(64, 79, 93, 0.7) !important;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  opacity: 0.7;
  transition: opacity ease-in-out 200ms;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 79, 93, 0.7);
  opacity: 1;
}
</style>
