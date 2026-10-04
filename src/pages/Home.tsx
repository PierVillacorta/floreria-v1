import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/productStore";
import { Loading } from "../components/ui/Loading";
const Home = () => {
  const { products, error, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if(products.length === 0 ) fetchProducts();
  }, []);

  if (loading)
    return <Loading/>
  if (error)
     return <p className="text-center mt-32 text-red-500">{error}</p>;
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-10 mt-24">
      {products.map((product) => (
        <ProductCard product={product} key={product.product_id} />
      ))}
    </main>
  );
};

export default Home;
