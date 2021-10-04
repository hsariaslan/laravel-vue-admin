<template>
  <div>
      <ol class="tw-p-0">
        <li
          v-for="(crumb, index) in crumbs"
          :key="index"
          class="tw-float-left tw-mr-1"
        >
          <router-link :to="crumb.path" class="breadcrumb-parent-link">
            <span class="tw-transition-all">{{ title !== null ? title : crumb.title }}</span>
          </router-link>
        </li>
      </ol>
  </div>
</template>

<script>
  import titleCase from 'ap-style-title-case'
  export default {
    name: 'Breadcrumbs',
    props: {
      title: {
        type: String,
        default: null,
      },
    },
    computed: {
      crumbs() {
        const fullPath = this.$route.fullPath
        const params = fullPath.startsWith('/')
        ? fullPath.substring(1).split('/')
        : fullPath.split('/')
        const crumbs = []

        let path = ''

        params.forEach((param, index) => {
          path = `${path}/${param}`
          const match = this.$router.match(path)

          if (match.name !== null) {
            crumbs.push({
              title: titleCase(param.replace(/-/g, ' ')),
              ...match,
            })
          }
        })

        if(crumbs[0].path == "/") {
          crumbs[0].title = "Dashboard"
        }

        return crumbs
      },
    },
  }
</script>

<style scoped>
  li:after {
    content: '»';
    display: inline;
    font-size: 0.9em;
    color: grey;
    padding: 0 0.0725em 0 0.15em;
    margin: 0 4px 0 7px;
  }
  li:last-child:after {
    content: '';
  }
  li a.router-link-exact-active, li a.router-link-active {
    color: grey !important;
  }
  li a.router-link-active:hover {
    color: #f56565 !important;
  }
</style>
