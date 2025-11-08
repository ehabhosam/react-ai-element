const AILoadingComponent = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background:
          "linear-gradient(-45deg, #6366f1, #8b5cf6, #06b6d4, #10b981)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 1.5s ease-in-out infinite",
        borderRadius: "8px",
        padding: "3px",
        opacity: 0.75,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.15))",
          backgroundSize: "200% 200%",
          animation: "innerGradient 2s ease-in-out infinite",
          borderRadius: "5px",
          position: "relative",
          overflow: "hidden",
        }}
      ></div>
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
          }
          25% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.4));
          }
          50% {
            background-position: 100% 100%;
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));
          }
          75% {
            background-position: 0% 100%;
            filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.4));
          }
          100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
          }
        }

        @keyframes innerGradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default AILoadingComponent;
