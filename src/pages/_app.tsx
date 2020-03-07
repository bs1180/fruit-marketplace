import "../styles/index.css";
import { CartProvider } from "react-use-cart";

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider id={1}>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
