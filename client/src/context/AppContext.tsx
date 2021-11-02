import {ReactNode, StrictMode, Suspense, useEffect, useReducer} from "react";
import {ThoriumProvider} from "./ThoriumContext";
import {AlertDialog} from "@thorium/ui/AlertDialog";
import {BrowserRouter as Router} from "react-router-dom";
import useEasterEgg from "../hooks/useEasterEgg";
import {ErrorBoundary, FallbackProps} from "react-error-boundary";
import bg from "../images/background.jpg";
import {FaSpinner} from "react-icons/fa";
import ToastContainer from "./ToastContext";

const Fallback: React.FC<FallbackProps> = ({error}) => {
  return (
    <div className="p-4 text-white">
      <h1 className="text-5xl">Error</h1>
      <h2 className="text-3xl">{error?.message}</h2>
    </div>
  );
};

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <div
      className="z-0 absolute top-0 bg-center bg-cover w-full h-full text-white"
      style={{
        backgroundImage: `linear-gradient(
  135deg,
  rgba(0, 0, 0, 1) 0%,
  rgba(0, 0, 0, 0) 40%,
  rgba(0, 0, 0, 0) 60%,
  rgba(0, 0, 0, 1) 100%
),
url(${bg})`,
      }}
    >
      {children}
    </div>
  );
};
const LoadingSpinner = () => {
  const [show, toggleShow] = useReducer(() => true, false);
  useEffect(() => {
    const timeout = setTimeout(toggleShow, 500);
    return () => clearTimeout(timeout);
  }, []);
  if (!show) return null;
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <FaSpinner className="animate-spin-step text-4xl text-white" />
    </div>
  );
};
/**
 * A component to contain all of the context and wrapper components for the app.
 */
export default function AppContext({children}: {children: ReactNode}) {
  useEasterEgg();
  return (
    <StrictMode>
      <Layout>
        <ErrorBoundary FallbackComponent={Fallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <AlertDialog>
              <ThoriumProvider>
                <Router>{children}</Router>
              </ThoriumProvider>
              <ToastContainer />
            </AlertDialog>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </StrictMode>
  );
}
