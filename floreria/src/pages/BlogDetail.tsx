import { useParams, Link, Navigate } from "react-router-dom";
import { blogs } from "../data/blogs";

export const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) return <Navigate to="/blogs" replace />;

  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blogs"
          className=" items-center gap-2 text-sm font-semibold
            uppercase tracking-wider text-brown-pc/60
            transition-colors duration-300 hover:text-amber-950 mb-8 block"
        >
          ← Volver al blog
        </Link>

        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-2xl mb-8"
        />

        <h1 className="text-4xl font-bold uppercase leading-tight mb-4">
          {blog.title}
        </h1>

        <div className="mx-auto h-1 w-14 rounded-full bg-amber-950 mb-8" />

        <div className="prose max-w-none text-brown-pc/80 leading-relaxed whitespace-pre-line">
          {blog.long_desc}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block rounded-xl bg-amber-950 px-8 py-4
              font-semibold text-white transition-all duration-300
              hover:bg-amber-900 hover:scale-[1.01] active:scale-95"
          >
            Ver nuestros productos
          </Link>
        </div>
      </div>
    </section>
  );
};

