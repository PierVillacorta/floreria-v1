import { Link } from "react-router-dom";
import { blogs } from "../data/blogs";

export const BlogsPage = () => {
  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-brown-pc/60">
            Noticias y curiosidades
          </p>
          <h1 className="mt-2 text-4xl font-bold uppercase">Blog</h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-amber-950" />
        </div>

        <div className="flex flex-col gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="grid grid-cols-1 md:grid-cols-[300px_1fr] overflow-hidden
                rounded-2xl border border-amber-900/10 bg-white shadow-sm
                hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="h-56 w-full object-cover md:h-full"
              />
              <div className="flex flex-col justify-center p-8">
                <h2 className="text-2xl font-bold uppercase leading-tight">
                  {blog.title}
                </h2>
                <p className="mt-4 leading-relaxed text-brown-pc/70">
                  {blog.short_desc}
                </p>
                <Link
                  to={`/blogs/${blog.id}`}
                  className="mt-6 inline-flex items-center gap-2 font-semibold
                    text-amber-950 hover:text-amber-700 transition-colors duration-300"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
