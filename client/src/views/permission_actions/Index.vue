<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="datas"
      :search="tableSearch"
      sort-by="no"
      dense
      class="elevation-1"
      :items-per-page="25"
      :footer-props="{ itemsPerPageOptions: [10, 15,  25,  50, 100, -1,] }"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                v-can="'create_permission'"
              >
                New Permission Action
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Action name"
                        :error-messages="nameErrors"
                        @input="input('name')"
                        @blur="input('name')">
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <v-dialog v-model="dialogDelete" max-width="700px" persistent>
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this permission action?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <template>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    OK
                  </v-btn>
                </template>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-spacer></v-spacer>
          <v-text-field
            v-model="tableSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

        </v-toolbar>
      </template>
      
      <template v-slot:item.no="{ item }">
        {{ datas.indexOf(item) + 1 }}
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="tw-flex tw-items-end tw-justify-end">
          <div class="tw-float-left tw-ml-2" v-can="'update_permission_action'">
            <v-icon small title="Edit" class="hover:tw-text-green-500" @click="editItem(item)">mdi-pencil</v-icon>
          </div>
          <div class="tw-float-left tw-ml-2" v-can="'delete_permission_action'">
            <v-icon small title="Delete" @click="deleteItem(item)" class="hover:tw-text-red-500">mdi-delete</v-icon>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { validationMixin } from 'vuelidate';
  import { required, minLength, maxLength, helpers } from 'vuelidate/lib/validators';
  import axios from 'axios';

  export default {
    name: 'PermissionCategories',

    data: () => ({
      datas:[],
      headers : [
        { text: 'No'      , value: 'no', },
        { text: 'Name'    , value: 'name', },
        { text: 'Actions' , value: 'actions', align: 'right', sortable: false, },
      ],
      tableSearch: '',
      loading: true,
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedId: 0,
      editedItem: {
        name: '',
      },
      defaultItem: {
        name: '',
      },
    }),
    
    mixins: [validationMixin],
    validations: {
      editedItem: {
        name: { required, minLength: minLength(3) , maxLength: maxLength(30), alpha: helpers.regex('alpha', /^[a-zA-Z_ ]*$/i), },
      }
    },

    created () {
      axios.get('http://localhost:8000/api/v1/permission-actions')
      .then((response) => {
        this.datas = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
    },

    methods: {
      editItem (item) {
        this.editedIndex = this.datas.indexOf(item);
        this.editedId = this.datas[this.editedIndex].uuid;
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem (item) {
        this.editedIndex = this.datas.indexOf(item);
        this.editedId = this.datas[this.editedIndex].uuid;
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        axios.delete('http://localhost:8000/api/v1/permission-actions/' + this.editedId)
        .then(() => {
          this.datas.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((error) => {
          console.log(error);
        });
      },

      close () {
        this.dialog = false;
        this.$v.$reset();
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      closeDelete () {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      async save () {
        this.result = false;
        this.errors = [];
        this.$v.$touch();

        if (!this.$v.$invalid) {
          if (this.editedIndex > -1) {
            await axios.patch('http://localhost:8000/api/v1/permission-actions/' + this.editedId, this.editedItem)
            .then(() => {
              Object.assign(this.datas[this.editedIndex], this.editedItem);
              this.result = 1;
              this.$v.$reset();
            })
            .catch((error) => {
              this.result = 0;
              this.errors = {
                status: error.response.status,
                message: error.response.data.message,
                errors: error.response.data.errors,
              };
            });
          } else {
            axios.post('http://localhost:8000/api/v1/permission-actions', this.editedItem)
            .then((response) => {
              this.datas.push(response.data.data);
              this.result = 1;
              this.$v.$reset();
            })
            .catch((error) => {
              this.result = 0;
              this.errors = {
                status: error.response.status,
                message: error.response.data.message,
                errors: error.response.data.errors,
              };
            });
          }
          this.close();
        }
      },

      input(input) {
        switch (input) {
          case 'name': this.$v.editedItem.name.$touch(); break;
        }
      },
    },

    computed: {
      ...mapGetters({loggedUser: 'auth/login'}),

      formTitle () {
        return this.editedIndex === -1 ? 'New Permission Action' : 'Edit Permission Action'
      },
      
      nameErrors () {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;
        !this.$v.editedItem.name.minLength && errors.push('Name must be minimum 3 characters long');
        !this.$v.editedItem.name.maxLength && errors.push('Name must be at most 20 characters long');
        !this.$v.editedItem.name.alpha && errors.push('Name must contain only letters and whitespaces.');
        !this.$v.editedItem.name.required && errors.push('Name is required.');
        return errors;
      },
    },
  }
</script>