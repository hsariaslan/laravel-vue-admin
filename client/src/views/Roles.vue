<template>
  <v-card>
    <CrudDataTable title="Role">
      <div slot="fields" class="tw-w-full">
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
          <v-text-field
            v-model="$store.state.data.name"
            label="Role Name"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
          <v-select
            label="Permissions"
            multiple
            chips
            persistent-hint
            v-model="$store.state.data.permissions"
            :items="permissions"
            item-text="name"
            item-value="id"
          >
            <template v-slot:prepend-item>
              <v-list-item
                ripple
                @click="toggle"
              >
                <v-list-item-action>
                  <v-icon :color="$store.state.data.permissions.length > 0 ? 'indigo darken-4' : ''">
                    {{ selectAllIcon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    Select All
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
          </v-select>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
          <span>Color</span>
          <v-color-picker
            v-model="$store.state.data.color"
            dot-size="42"
            hide-canvas
            hide-inputs
            hide-mode-switch
            hide-sliders
            show-swatches
            swatches-max-height="100"
            width="full"
          ></v-color-picker>
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
  import Localbase from 'localbase'
  import CrudDataTable from "@/components/CrudDataTable.vue";
  let db = new Localbase('db')
  db.config.debug = false

  export default {
    name: 'Roles',
    components: {
      CrudDataTable,
    },

    data: () => ({
      permissions: [],
      selectedPermissions: [],
    }),

    computed: {
      ...mapGetters([
        'data',
        'datas',
        'dataIndex',
      ]),
      allPermissions () {
        return this.data.permissions.length === this.permissions.length
      },
      somePermissions () {
        return this.data.permissions.length > 0 && !this.allPermissions
      },
      selectAllIcon () {
        if (this.allPermissions) return 'mdi-close-box'
        if (this.somePermissions) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
      selectAll: {
        get: function () {
          return this.permissions ? this.selectedPermissions.length == this.permissions.length : false;
        },
        set: function (value) {
          let selectedPermissions = [];
          if (value) {
            this.permissions.forEach(function (permission) {
              selectedPermissions.push(permission.id);
            });
          }
          this.selectedPermissions = selectedPermissions;
        }
      }
    },

    created () {
      db.collection('permissions').get().then(datas => {
        this.permissions = datas
      })
      this.$store.dispatch('table', 'roles')
      this.$store.dispatch('getWithRelations', {
        relations: ['permissions']
      })
      let headers = [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Role Name'   , value: 'name' },
        { text: 'Permissions' , value: 'permissions' },
        { text: 'Color'       , value: 'color', align: 'center' },
        { text: 'Actions'     , value: 'actions', align: 'right', sortable: false },
      ]

      let defaultData = {
        id          : 1,
        name        : '',
        permissions : '',
        color       : '',
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
      toggle () {
        this.$nextTick(() => {
          if (this.allPermissions) {
            this.$store.dispatch('defaultData')
          } else {
            // this.selectAll
            let permissions = []
            this.permissions.forEach(permission => {
              permissions.push(permission.id)
            })

            // console.log(permissions)

            this.$store.dispatch('dataPermissions', permissions)
          }
        })
      },
    },
  }
</script>
