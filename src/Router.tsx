import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/reset.css";
import "./css/global.css";
import App from "./App.tsx";
import Home from "./components/Home/Home.tsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.tsx";

const Store = lazy(() => import("./components/Store/Store.tsx"));
const FruitView = lazy(() => import("./components/FruitSection/FruitView/FruitView.tsx"));
const Bag = lazy(() => import("./components/Bag/Bag.tsx"));

const PageFallback = () => <div style={{ minHeight: "100vh" }} aria-busy="true" aria-label="Loading page" />;

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/store",
          element: (
            <Suspense fallback={<PageFallback />}>
              <Store />
            </Suspense>
          ),
        },
        {
          path: "/store/:slug",
          element: (
            <Suspense fallback={<PageFallback />}>
              <FruitView />
            </Suspense>
          ),
        },
        {
          path: "/bag",
          element: (
            <Suspense fallback={<PageFallback />}>
              <Bag />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
