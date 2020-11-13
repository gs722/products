<template>
  <div>
    <div class="form-group">
      <label for="product-name">Наименование</label>
      <input v-model="value.name" class="form-control" id="product-name">
    </div>

    <div class="form-group">
      <label for="product-vendor_code">Артикул</label>
      <input v-model="value.vendor_code" class="form-control" id="product-vendor_code">
    </div>

    <button type="submit" class="btn btn-primary" @click="update()">Редактировать</button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  methods: {
    update() {
      this.$emit('update', this.value)
    }
  }
}
</script>

<style scoped>

</style>
