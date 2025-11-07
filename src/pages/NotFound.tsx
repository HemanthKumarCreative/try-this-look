import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 404 - Route not found
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl sm:text-2xl text-muted-foreground">Oops ! Page introuvable</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline font-medium transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
