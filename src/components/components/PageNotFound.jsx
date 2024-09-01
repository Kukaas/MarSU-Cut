import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const PageNotFound = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-3 max-w-3xl mx-auto text-center">
        <Link to="/" className="font-bold hover:text-current text-6xl ">
          <span
            className="px-2 rounded-lg text-white"
            style={{
              background:
                "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404!
          </span>{" "}
          Page Not Found
        </Link>
        <p className="text-xl mt-7">Oops! Page not found!</p>
        <p className="mt-5 ">
          Sorry the page you have accessed is broken or does not exist.
        </p>
        <div className="flex flex-row gap-2 mt-4">
          <Button
            className="w-full mt-3 rounded-lg text-white text-lg"
            style={{
              background:
                "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
            }}
            size="lg"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Redirecting</span>
              </div>
            ) : (
              "Go Home"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
