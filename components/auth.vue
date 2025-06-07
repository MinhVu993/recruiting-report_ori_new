<template> </template>
<script>
export default {
  data() {
    return {};
  },
  beforeMount() {
    if (!this.$session.has("recruiting-report")) {
      this.$router.push("./");
    }
  }
};
</script>