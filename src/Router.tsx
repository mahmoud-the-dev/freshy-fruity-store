import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/reset.css";
import "./css/global.css";
import App from "./App.tsx";
const Home = lazy(() => import("./components/Home/Home.tsx"));
const Store = lazy(() => import("./components/Store/Store.tsx"));
const FruitView = lazy(() => import("./components/FruitSection/FruitView/FruitView.tsx"));
const Bag = lazy(() => import("./components/Bag/Bag.tsx"));
const ErrorPage = lazy(() => import("./components/ErrorPage/ErrorPage.tsx"));

const withSuspense = (component: ReactNode) => (
  <Suspense fallback={<p>Loading Freshy Fruity...</p>}>{component}</Suspense>
);

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: withSuspense(<ErrorPage />),
      children: [
        {
          path: "/",
          element: withSuspense(<Home />),
        },
        {
          path: "/home",
          element: withSuspense(<Home />),
        },
        {
          path: "/store",
          element: withSuspense(<Store />),
        },
        {
          path: "/store/:slug",
          element: withSuspense(<FruitView />),
        },
        {
          path: "/bag",
          element: withSuspense(<Bag />),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
