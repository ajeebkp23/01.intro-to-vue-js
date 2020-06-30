Vue.component('product-review',{
    props: {
        product: Object
    },
    template: `
                <div>
                    <div v-if="product.reviews.length">
                        <h2 >Reviews ({{ product.reviews.length }})</h2>
                        <div :style="{color:  review.isRecommended ? 'green' : 'red' }" v-for="review in product.reviews">
                            <div> Name: {{review.name}} </div>
                            <div> Comment: {{review.comment}} </div>
                            <div> Rating: {{review.rating}} </div>

                            <div> Recommended ? : {{review.isRecommended}} {{ review.isRecommended ? 'Yesss..' : 'No Way ..' }} </div>
                        </div>
                    </div>
                    <div>
                        <h2>Add your Reviews</h2>
                        <form @submit.prevent="submitReview">
                            <div>
                                Name:
                                <input type="text" v-model="name">
                            </div>
                            
                            <div>
                                Comment:
                                <input type="text" v-model="comment">
                            </div>
                            <div>
                                Rating:
                                <select v-model="rating">
                                    <option v-for="ratingId in 5" :value="ratingId">{{ratingId}}</option>
                                </select>
                            </div>
                            <div>
                                Would you recommend ? [Selected: {{isRecommended}}]
                                <input type="radio" v-model="isRecommended" value="1">
                                Yes
                                <input type="radio" v-model="isRecommended" value="">
                                No
                            </div>
                            <input type="submit" value="Add Review">
                        </form>
                    </div>
                </div>
    `,
    data() {
        return {
            name: null,
            comment: null,
            rating: null,
            isRecommended: null
        }
    },
    methods: {
        submitReview() {
            this.product.reviews.push({name:this.name,comment:this.comment,rating:this.rating,isRecommended: this.isRecommended})
            // this.$emit('submit-review',{name:this.name,comment:this.comment,rating:this.rating})
            this.name = null
            this.comment = null
            this.rating = null
            this.isRecommended = null
        }
    }
})
Vue.component("product-item", {
  props: {
    product: Object,
    cartcount: Number,
  },
  template: `
		<div class="row" style="border: 2px solid line;">
			<div class="col-12">
				<div class="d-flex justify-content-around bd-highlight mb-3">
					<div :style="styles.firstHalf">
						<h1> {{ title }} </h1>
						<p>{{ description }}</p>
						<img :src="image" alt="No alt" width="200px" height="auto" >
					</div>
					<div :style="styles.secondHalf">
						<span  :style="outOfStock.nah"  v-if="inStock">On Sale</span>
						<span   :style="outOfStock.yeah" v-else>
							<span :style="outOfStock.nah">
								NOT in Stock
							</span>
						</span>
						<ul>
							<li v-for="[size, index] in sizes.entries()" :key="index">{{ index }}</li>
						</ul>
						<span v-if="product.premium">Free Shipping</span>
						<button 
						@click="addToCart"
						:disabled="!inStock"
						>Add to cart</button>
						<button 
						@click="removeFromCart"
						:disabled="cartcount <= 0"
						>Remove From cart</button>
						<h4>Variants</h4>
						<ul>
							<li 
							v-for="variant in variants" 
							:key="variant.key" 
							@mouseover="chooseVariant(variant)"
							:style="{background: variant.color}"
							>{{ variant.name }}</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		`,
  data() {
    return {
      description: "A pair of warm, fuzzy socks",
      image: "blue.png",
      sizes: ["small", "medium", "large"],
      selectedVariant: 0,
      variants: [
        {
          key: "green",
          name: "Green Buffy",
          img: "green.png",
          color: "green",
          qty: 3,
        },
        {
          key: "blue",
          name: "Blue Buffy",
          img: "blue.png",
          color: "blue",
          qty: 5,
        },
      ],
      outOfStock: {
        yeah: {
          textDecoration: "line-through",
          color: "red",
        },
        nah: {
          color: "green",
        },
      },
      styles: {
        firstHalf: {
          background: "#def2f2 none repeat scroll 0% 0%",
          float: 'left',
          width: '50%'
        },
        secondHalf: {
          background: "#fff6eb none repeat scroll 0% 0%",
          float: 'left',
          width: '50%'
        },
        topbar: {
          background: "#9ef",
          height: "50px",
        },
        normalButton: {
          borderRadius: "5px",
          background: "lightgreen",
        },
        disabledButton: {
          border: "red 3px solid",
          textDecoration: "line-through",
        },
      },
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", {
        product: this.product,
        variant: this.selectedVariant,
      });
    },
    removeFromCart() {
    //   debugger;
      this.$emit("remove-from-cart", {
        product: this.product,
        variant: this.selectedVariant,
      });
    },
    chooseVariant(selected) {
      this.selectedVariant = selected;
      this.image = selected.img;
    },
  },
  computed: {
    inStock() {
      return this.cartcount < this.selectedVariant.qty;
    },
    title() {
      return `${this.product.brand} -> ${this.product.name}`;
    },
  },
  created() {
    // `this` points to the vm instance
    this.selectedVariant = this.variants[0];
  },
});
let vm = new Vue({
  el: "#app",
  data: {
    cart: [],
    productList: [
      {
        pk: 1,
        name: "Boots",
        brand: "Adidas",
        premium: false,
        reviews: [
            
        ]
      },
      {
        pk: 2,
        name: "Socks",
        brand: "Puma",
        premium: true,
        reviews: [

        ]
      },
      {
        pk: 3,
        name: "T Shirt",
        brand: "Decathlon",
        premium: true,
        reviews: [

        ]
      },
      {
        pk: 4,
        name: "Bat",
        brand: "MRF",
        premium: false,
        reviews: [

        ]
      },
    ],
    styles: {
        alCart: {
            border: '1px solid red',
            padding: '5px 20px'
        },
        topbar: {
            border: '2px solid #cfc'
        }
    }
  },
  methods: {
    updateCart(producInfo) {
      this.cart.push(producInfo);
    },
    removeItem(productInfo) {
      // But here, not solved yet
      // Ideally, matching variant and product should be removed
        // (item) => item.variant.key != productInfo.variant.key
        // (item) => (item.product.pk != producInfo.product.pk) && (item.variant.key != productInfo.variant.key)
      this.cart = this.cart.filter(
        (item) => !((item.product.pk == productInfo.product.pk) && (item.variant.key == productInfo.variant.key))
      );
    },
    submitReview(reviewObject){
        this.reviews.push(reviewObject)
    }
  },
});
