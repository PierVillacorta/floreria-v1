import { Products as products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
const Home = () => {
  const  {dispatch} = useCart()
  return (
    <main className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 mt-24 gap-y-32 justify-items-center">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} dispatch={dispatch}/>
      ))}
    </main>
  );
};

export default Home;
