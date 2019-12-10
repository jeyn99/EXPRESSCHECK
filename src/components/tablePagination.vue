<template>
  <div id="app1">
    <v-app>
      <v-data-table :headers="headers" :items="expenses" :search="search" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              EXPENSE LIST
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-divider class="mx-4" inset vertical></v-divider>
              TOTAL: {{ totalAmount }}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" class="xs-2 ma-4" v-on="on">ADD EXPENSE</v-btn>
                <v-btn color="primary" @click="reset" class="xs-2 ma-4">RESET</v-btn>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  label="Search"
                  append-icon="mdi-magnify"
                  single-line
                  hide-details
                ></v-text-field>
              </template>

              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem._id" label="ID" style="display:none"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.item" type="string" label="ITEM"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.date"
                          type="datetime"
                          label="DATE"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.amount" label="AMOUNT" type="number"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-app>
  </div>
</template>
 
<script>
/* eslint-disable */

import axios from "axios";
export default {
  data: () => ({
    search: "",
    dialog: false,
    headers: [
      {
        text: "Item",
        align: "left",
        sortable: false,
        value: "item"
      },
      { text: "Date", value: "date" },
      { text: "Amount", value: "amount" },
      { text: "Actions", value: "action", sortable: false }
    ],
    expenses: [],
    totalAmount: 0,
    editedIndex: -1,
    editedItem: {
      _id: null,
      item: "",
      date: new Date(),
      amount: null
    },
    defaultItem: {
      item: "",
      date: new Date(),
      amount: null
    },
    checkerItem: {
      _id: null,
      item: "",
      amount: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "EXPENSE DETAILS" : "EDIT EXPENSE";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
    this.getAll(true);
    this.getAll(false)
  },

  methods: {
    initialize() {
      this.expenses = [];
    },
    reset() {
      confirm("Are you sure to reset items? ") &&
        axios
          .delete("http://localhost:5000/delete/all")
          .then(res => {
            this.initialize();
            this.totalAmount = 0;
            alert("Reset");
          })
          .catch(err => {
            alert(err);
          });
    },
    getAll(d) {
      if (d) {
        console.log("This is All!")
        axios
          .get("http://localhost:5000/item/retrieve/all")
          .then(res => {
            this.expenses = res.data;
          })
          .catch(err => {
            alert(err);
          });
      } else {
        axios
          .get("http://localhost:5000/item/retrieve/all")
          .then(res => {
            this.totalAmount = 0;
            for (let i = 0; i < res.data.length; i++) {
              this.totalAmount = this.totalAmount + Number(res.data[i].amount);
            }
          })
          .catch(err => {
            alert(err);
          });
      }
    },
    editItem(item) {
      this.editedIndex = this.expenses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.checkID(item._id);
    },

    deleteItem(item) {
      const index = this.expenses.indexOf(item);
      // console.log(item)
      confirm("Are you sure you want to delete this item?") &&
        axios
          .delete("http://localhost:5000/item/delete/" + item._id)
          .then(res => {
            alert("Succesfully Deleted!");
            this.expenses.splice(index, 1);
          })
          .catch(err => {
            alert(err);
          });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
      this.getAll(false);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.expenses[this.editedIndex], this.editedItem);
        if (
          this.expenses[this.editedIndex].item != this.checkerItem.item ||
          this.expenses[this.editedIndex].amount != this.checkerItem.amount
        ) {
          //isave sa database
          if (
            this.expenses[this.editedIndex].amount < 0 &&
            this.expenses[this.editedIndex].item != ""
          ) {
            this.expenses[this.editedIndex] = this.checkerItem;
            alert("Check Input");
          } else {
            confirm("Are you sure to update this item? ") &&
              axios
                .put(
                  "http://localhost:5000/item/update/",
                  this.expenses[this.editedIndex]
                )
                .then(res => {
                  alert("Succesfully Updated!");
                })
                .catch(err => {
                  alert(err);
                });
          }
        } else {
          this.expenses[this.editedIndex] = this.checkerItem;
          alert("Fields not updated!");
        }
      } else {
        //save for the first time
        console.log("Save for the first time");
        let item = this.editedItem;
        if (item.item != "" && item.amount > 0) {
          axios
            .post("http://localhost:5000/item/create", this.editedItem)
            .then(res => {
              this.expenses.push(res.data);
              // this.checkerItem = res.data;
            })
            .catch(err => {
              alert(err);
            });
        } else {
          alert("Please Check Input!");
        }
      }
      // window.location.reload();
      this.close();
    },
    checkID(id) {
      //retrieve by id
      axios
        .get("http://localhost:5000/item/retrieve/" + id)
        .then(res => {
          this.checkerItem = res.data;
        })
        .catch(err => {
          alert(err);
        });
    }
  }
};
</script>
<style>
#app1 {
  max-width: 90% !important;
  margin-left: 5% !important;
  margin-top: 5%;
}
</style>
