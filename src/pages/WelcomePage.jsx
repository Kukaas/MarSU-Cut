import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen mt-[-80px]"
      initial={{ opacity: 0, x: -100 }} // Start from the left
      animate={{ opacity: 1, x: 0 }} // Animate to the default position
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>MarSUKAT | Get Started</title>
        <meta
          name="description"
          content="Welcome to MarSUKAT. We are glad to have you here. Login or Register to explore our features"
        />
        <meta name="keywords" content="marsu, MarSUKAT" />
      </Helmet>
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
            MarSU
          </span>
          KAT
        </Link>
        <p className="text-xl mt-7">Welcome to MarSUKAT!</p>
        <p className="mt-5 ">
          We&apos;re glad to have you here. Start exploring our features now.
        </p>
        <motion.div
          className="flex flex-row gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="w-full mt-3 rounded-lg text-white text-lg"
            style={{
              background:
                "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
            }}
            size="lg"
            onClick={handleClicked}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 animate-spin" />
                <span>Redirecting</span>
              </div>
            ) : (
              "Get Started"
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomePage;
