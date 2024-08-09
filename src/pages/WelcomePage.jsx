import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      navigate("/dashboard?tab=home-admin");
    } else if (currentUser && currentUser.isAdmin === false) {
      navigate("/dashboard?tab=home");
    } else {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleClicked = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/sign-up");
      setLoading(false);
    }, 3000); // 2000ms delay
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-[-80px]">
      <Helmet>
        <title>MarSU Cut | Get Started</title>
        <meta name="description" content=""/>
        <meta name="keywords" content="marsu, marsu cut"/>
        <link rel="canonical" href="https://marsu.cut.kukaas.tech/" />
      </Helmet>
      <div className="p-3 max-w-3xl mx-auto text-center">
        <Link to="/" className="font-bold hover:text-current text-6xl ">
          <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            MarSU
          </span>{" "}
          Cut
        </Link>
        <p className="text-xl mt-7">Welcome to MarSU Cut!</p>
        <p className="mt-5 ">
          We&apos;re glad to have you here. Start exploring our features now.
        </p>
        <div className="flex flex-row gap-2 mt-4">
          <Button
            className="w-full p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
            size="lg"
            onClick={handleClicked}
          >
            {loading ? (
              <span className="loading-dots">Get Started</span>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
