<template>
  <div id="app">
    <products-list :products="productsList"
                   :limit="limit"
                   class="product-list"
                   :class="{loading: loading === 1}"
                   @edit="showEdit"/>
    <div class="current-page">
      Страница: {{ page + 1 }}
    </div>
    <nav>
      <ul class="pagination">
        <li class="page-item">
          <button :disabled="offset === 0" class="page-link" @click="previous">Previous</button>
        </li>
        <li class="page-item">
          <button :disabled="products.length < limit" class="page-link" @click="next">Next</button>
        </li>
      </ul>
    </nav>
    <modal name="product-edit-modal">
      <product-edit v-if="productEdit"
                    :value="productEdit"
                    class="product-edit-modal-content"
                    @update="updateProduct"/>
    </modal>
  </div>
</template>

<script>
import ProductsList from './components/ProductsList.vue'
import ProductEdit from "./components/ProductEdit"
import gql from 'graphql-tag'

const PRODUCTS_LIMIT = 20

const GET_PRODUCTS_QUERY = gql`
    query products($limit: Int, $offset: Int) {
      products(limit: $limit, offset: $offset, order_by: {id: asc}) {
        id,
        name,
        series,
        vendor_code,
        prices {
          price
        }
      }
    }
  `

const REFETCH_PRODUCT_QUERY = gql`
  query updateCache($id: String!) {
    products(where: {id: {_eq: $id}}) {
      id,
      name,
      series,
      vendor_code,
      prices {
        price
      }
    }
  }
`

const UPDATE_PRODUCT_QUERY = gql`
  mutation UpdateProduct($id: String!, $name: String!, $vendorCode: String!) {
    update_products(where: {id: {_eq: $id}}, _set: {name: $name, vendor_code: $vendorCode}) {
      affected_rows
    }
  }
`

export default {
  name: 'App',
  components: {
    ProductsList,
    ProductEdit
  },
  data() {
    return {
      products: [],
      productEdit: null,
      loading: 0,
      limit: PRODUCTS_LIMIT,
      page: 0
    }
  },
  apollo: {
    products: {
      query: GET_PRODUCTS_QUERY,
      variables() {
        return {
          limit: PRODUCTS_LIMIT,
          offset: this.offset
        }
      },
      loadingKey: 'loading',
    },
  },
  computed: {
    productsList() {
      return this.products
          .map((product) => ({
            id: product.id,
            name: product.name,
            series: product.series,
            vendor_code: product.vendor_code,
            price: product.prices.length > 0 ? product.prices[0].price : null,
          }))
    },
    offset() {
      return this.page * this.limit
    }
  },
  methods: {
    showEdit(product) {
      this.productEdit = product
      this.$modal.show('product-edit-modal')
    },
    updateProduct(product) {
      this.$apollo.mutate({
        mutation: UPDATE_PRODUCT_QUERY,
        variables: {
          id: product.id,
          name: product.name,
          vendorCode: product.vendor_code,
        },
        refetchQueries: [{
          query: REFETCH_PRODUCT_QUERY,
          variables: {
            id: product.id,
          },
        }]
      })
      this.$modal.hide('product-edit-modal')
      this.productEdit = null
    },
    previous() {
      this.page--
    },
    next() {
      this.page++
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.product-list {
  max-width: 1000px;
  margin: 30px auto;
}

.product-edit-modal-content {
  margin: 20px 30px;
}

.pagination {
  width: 200px;
  text-align: center;
  margin: 20px auto;
}

.pagination .page-link {
  width: 100px;
}

.current-page {
  width: 200px;
  text-align: center;
  margin: 20px auto;
}

.loading {
  opacity: 0.2;
}

.page-link[disabled=disabled] {
  visibility: hidden;
}
</style>
