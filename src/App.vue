<template>
  <div id="app">
    <Carousel />
    <Table></Table>
  </div>
</template>

<script>
import Carousel from "@/components/carousel.vue";
// import Modal from "@/components/modal.vue";
import Table from "@/components/tablePagination.vue";

export default {
  components: {
    Carousel,
    // Modal,
    Table
  },
  methods: {
    handleClick: function() {
      alert("test");
    }
  }
};
</script>
