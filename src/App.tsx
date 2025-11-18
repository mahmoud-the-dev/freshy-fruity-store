import styles from "./App.module.css";
import { StoreContextProvider, useStoreContext } from "./Context";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CatalogSplash from "./components/CatalogSplash/CatalogSplash";

const AppShell = () => {
  const store = useStoreContext();

  if (store?.catalogStatus === "error") {
    return <CatalogSplash error={store.catalogError} onRetry={store.reloadCatalog} />;
  }

  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <StoreContextProvider>
      <AppShell />
    </StoreContextProvider>
  );
};

export default App;
