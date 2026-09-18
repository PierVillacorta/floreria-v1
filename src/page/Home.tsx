import { Products as products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
const Home = () => {
  const  {dispatch} = useCart()
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-10 mt-24">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} dispatch={dispatch}/>
      ))}
    </main>
  );
};

export default Home;
