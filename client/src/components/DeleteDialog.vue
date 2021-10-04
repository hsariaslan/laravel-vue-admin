<template>
  <v-dialog v-model="$store.state.dialogDelete" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h5">Are you sure you want to delete this {{title}}?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <template>
          <v-btn color="blue darken-1" text @click="$store.dispatch('dialogClose')">Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="$store.dispatch('delete', $store.state.data)"
          >
            OK
          </v-btn>
        </template>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'DeleteDialog',
    props: {
      title: {
        type: String,
        default: null,
      },
    }
  }
</script>
