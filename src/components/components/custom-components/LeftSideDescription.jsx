const LeftSideDescription = ({ black, gradient, description }) => {
  return (
    <div className="flex-1 mb-4">
      <div className="flex flex-col items-start font-bold hover:text-current text-4xl">
        {black}
        <span
          className="rounded-lg text-white"
          style={{
            background:
              "linear-gradient(90deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {gradient}
        </span>
      </div>
      <p className="text-sm mt-2">{description}</p>
    </div>
  );
};

export default LeftSideDescription;
