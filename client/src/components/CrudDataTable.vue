<template>
  <v-data-table
    :headers="headers"
    :items="datas"
    :search="tableSearch"
    sort-by="id"
    dense
    class="elevation-1"
    :items-per-page="itemsPerPage"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-dialog
          v-model="$store.state.dialog"
          max-width="500px"
          persistent
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New {{title}}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle + title }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <slot name="fields"></slot>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="$store.dispatch('dialogClose')"
              >
                Cancel
              </v-btn>
              <slot name="saveButton"></slot>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="$store.state.tableSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <DeleteDialog title="role" />
      </v-toolbar>
    </template>
    <template v-slot:item.roles="{ item }">
      <v-chip
        v-for="(role, idx) in item.roles"
        :key="idx"
        :color="role.color"
        dark
      >
        {{ role.name }}
      </v-chip>
    </template>
    <template v-slot:item.permissions="{ item }">
      <span
        v-for="(permission, idx) in item.permissions"
        :key="idx"
        class="tw-bg-gray-200 tw-mx-1 tw-py-1 tw-px-2 tw-rounded-full"
      >
        {{ permission.name }}
      </span>
    </template>
    <template v-slot:item.color="{ item }">
      <v-chip
        :color="item.color"
        dark
      >
        {{ item.color }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="$store.dispatch('edit', item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="$store.dispatch('dialogDelete', item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
  import { mapGetters } from "vuex";
  import Localbase from 'localbase'
  import DeleteDialog from "@/components/DeleteDialog.vue";
  let db = new Localbase('db')
  db.config.debug = false

  export default {
    name: 'CrudDataTable',
    components: {
      DeleteDialog,
    },
    props: {
      title: String,
      itemsPerPage: {
        type: Number,
        default: -1
      },
    },

    computed: {
      ...mapGetters([
        'datas',
        'headers',
        'tableSearch',
        'dataIndex',
      ]),
      formTitle () {
        return this.dataIndex === -1 ? 'New ' : 'Edit '
      },
    },
  }
</script>
