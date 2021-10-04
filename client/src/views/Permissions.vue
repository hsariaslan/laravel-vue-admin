<template>
  <v-card>
    <CrudDataTable title="Permission" :itemsPerPage="15">
      <div slot="fields" class="tw-w-full">
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
          <v-text-field
            v-model="$store.state.data.name"
            @input="makeSlug"
            label="Permission Name"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
          <v-text-field
            v-model="$store.state.data.slug"
            label="Slug"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
          <v-select
            v-model="$store.state.data.category"
            :items="categories"
            label="Category"
            persistent-hint
          >
          </v-select>
        </v-col>
      </div>
      <div slot="saveButton">
        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>
      </div>
    </CrudDataTable>
  </v-card>
</template>

<script>
  import { mapGetters } from "vuex";
  import CrudDataTable from "@/components/CrudDataTable.vue";
  export default {
    name: 'Permissions',
    components: {
      CrudDataTable,
    },

    data () {
      return {
        categories: [
          'Dashboard',
          'Users',
          'Roles',
        ],
      }
    },

    computed: {
      ...mapGetters([
        'data',
        'datas',
        'dataIndex',
      ]),
    },

    created () {
      this.$store.dispatch('get', 'permissions')
      let headers = [
        { text: 'ID',         value: 'id', },
        { text: 'Permission', value: 'name', align: 'start', },
        { text: 'Slug',       value: 'slug', },
        { text: 'Category',   value: 'category' },
        { text: 'Actions',    value: 'actions', align: 'right', sortable: false },
      ]

      let defaultData = {
        id          : 1,
        name        : '',
        slug        : '',
        category    : '',
        created_at  : '',
        updated_at  : '',
      }

      this.$store.dispatch('headers', headers)
      this.$store.dispatch('data', defaultData)
    },

    methods: {
      save () {
        if (this.dataIndex > -1) {
          this.$store.dispatch('update', this.data)
        } else {
          this.data.id = this.datas.length === 0 ? 1 : (this.datas[this.datas.length - 1].id + 1)
          this.$store.dispatch('create', this.data)
        }
      },

      makeSlug() {
        this.$store.state.data.slug = this.stringToSlug(this.data.name)
      },

      stringToSlug (str) {
        str = str.toString()
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '_') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
      }
    }
  }
</script>
