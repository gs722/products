<template>
  <div>
    <table class="table">
      <tr>
        <th>Наименование</th>
        <th>Артикул</th>
        <th>Серия</th>
        <th>Цена</th>
        <th></th>
      </tr>
      <tr v-for="(product, index) of products" :key="index">
        <td>{{ product.name }}</td>
        <td>{{ product.vendor_code }}</td>
        <td>{{ product.series }}</td>
        <td class="price">{{ formatPrice(product.price) }}</td>
        <td>
          <button class="btn" @click="edit(product)">Редактировать</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    products: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      required: true,
    }
  },
  methods: {
    edit(product) {
      this.$emit('edit', product)
    },
    formatPrice(value) {
      return Number.parseInt(value.toFixed()).toLocaleString()
    }
  }
}
</script>

<style scoped>
.price {
  text-align: right;
}
</style>
