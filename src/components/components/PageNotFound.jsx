import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const PageNotFound = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }
    , 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-3 max-w-3xl mx-auto text-center">
        <Link to="/" className="font-bold hover:text-current text-6xl ">
          <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            404!
          </span>{" "}
          Not Found
        </Link>
        <p className="text-xl mt-7">Oops! Page not found!</p>
        <p className="mt-5 ">
          Sorry the page you have accessed is broken or does not exist.
        </p>
        <div className="flex flex-row gap-2 mt-4">
          <Button
            className="w-full p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
            size="lg"
            onClick={handleClick}
          >
            {loading ? "Loading..." : "Go to home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
