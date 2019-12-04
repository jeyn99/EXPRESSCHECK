<template>
  <v-carousel cycle height="500" hide-delimiters>
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
      reverse-transition="fade-transition"
      transition="fade-transition"
    ></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: require("@/assets/expense.png")
        },
        {
          src: require("@/assets/expense1.png")
        },
        {
          src: require("@/assets/expense2.jpg")
        }
      ]
    };
  }
};
</script>

<style>
.theme--dark.v-btn.v-btn--icon {
    color: #FFFFFF;
    display: none;
}

.v-btn--icon.v-size--default {
    height: 36px;
    width: 36px;
}
</style>
