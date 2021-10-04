<template>
  <div>dene</div>
</template>

<script>
  export default {
    data: () => ({
      user: {
        username: null,
        password: null,
        rememberMe: false,
      },
    }),
    created() {
      this.$store.dispatch('auth/logout', this.user).then(() => {
        this.$router.push('/login')
      })
    }
  };
</script>
