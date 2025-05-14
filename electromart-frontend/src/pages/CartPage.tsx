import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/4 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl">0 Items</h2>
            </div>
            <p className="text-gray-500">Your cart is currently empty.</p>
            <Link
              to="/products"
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="flex shadow-md my-10">
        <div className="w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{cartItems.length} Items</h2>
          </div>

          <div className="flex mt-10">
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
              Product Details
            </h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">
              Quantity
            </h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">
              Price
            </h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">
              Total
            </h3>
          </div>

          {cartItems.map((item) => {
            const imageUrl =
              item.primaryImageUrl || 'https://via.placeholder.com/80?text=No+Img';

            return (
              <div
                key={item.id}
                className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
              >
                <div className="flex w-2/5">
                  <div className="w-20 h-24 flex items-center justify-center bg-gray-100 rounded">
                    <img
                      className="max-h-full max-w-full object-contain"
                      src={imageUrl}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">{item.name}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="font-semibold hover:text-red-700 text-red-500 text-xs mt-1 self-start"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex justify-center w-1/5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="font-semibold hover:bg-gray-300 px-2 py-1 rounded"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    className="mx-2 border text-center w-8"
                    type="text"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (!isNaN(newQuantity) && newQuantity > 0) {
                        updateQuantity(item.id, newQuantity);
                      }
                    }}
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="font-semibold hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>

                <span className="text-center w-1/5 font-semibold text-sm">
                  USD {item.price.toFixed(2)}
                </span>
                <span className="text-center w-1/5 font-semibold text-sm">
                  USD {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}

          <Link
            to="/products"
            className="flex font-semibold text-indigo-600 text-sm mt-10"
          >
            <svg
              className="fill-current mr-2 text-indigo-600 w-4"
              viewBox="0 0 448 512"
            >
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div className="w-1/4 px-8 py-10 bg-gray-100">
          <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
          <div className="mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>USD {getCartTotal().toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <button className="bg-indigo-500 hover:bg-indigo-700 font-semibold py-3 text-sm text-white uppercase w-full">
                Checkout
              </button>
            </Link>
            <button
              onClick={clearCart}
              className="mt-3 bg-red-500 hover:bg-red-700 font-semibold py-3 text-sm text-white uppercase w-full"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
