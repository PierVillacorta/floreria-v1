import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="hero min-h-screen bg-white-semi">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-9xl font-black text-brown-pc">404</h1>
      <p className="text-2xl font-bold mt-4 text-brown-pc">Page Not Found</p>
      <p className="py-4 text-base-content/70">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to={"/"} className="btn bg-amber-950">
        Go Back Home
      </Link>
    </div>
  </div>
</div>

  )
}

export default NotFoundPage