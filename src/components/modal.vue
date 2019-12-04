<template>
  <v-app>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">ADD ITEM</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Expense Check</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Item*" v-model="expense.item" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Amount*" v-model="expense.amount" type="number" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Date*" type="datetime" v-model="expense.date" disabled></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      expense: {
        item: null,
        date: new Date(),
        amount: null
      }
    };
  },
  methods: {
    save() {
      this.axios
        .post("http://localhost:5000/item/create", this.expense)
        .then(res => {
          alert(res);
          this.dialog = false;
          alert("Succesfully Added");
        })
        .catch(err => {
          alert(err);
        });
    }
  }
};
</script>