import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { initialFilters } from "./data/filters";
import { Fruits } from "./data/types";
import { Filters } from "./data/types";
import { fetchProducts, mapProduct } from "./api/client";

type SetFruits = Dispatch<SetStateAction<Fruits>>;
type SetFilters = Dispatch<SetStateAction<Filters>>;
export type CatalogStatus = "loading" | "ready" | "error";

interface StoreContext {
  fruits: Fruits;
  setFruits: SetFruits;
  filters: Filters;
  setFilters: SetFilters;
  catalogStatus: CatalogStatus;
  catalogError: string | null;
  reloadCatalog: () => void;
}

interface StoreContextProviderProps {
  children: ReactNode;
}

const StoreContext = createContext<StoreContext | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useStoreContext = () => {
  return useContext(StoreContext);
};

export const StoreContextProvider: FC<StoreContextProviderProps> = ({ children }) => {
  const [fruits, setFruits] = useState<Fruits>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>("loading");
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reloadCatalog = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCatalogStatus("loading");
    setCatalogError(null);

    fetchProducts()
      .then((products) => {
        if (cancelled) return;
        setFruits(products.map(mapProduct));
        setCatalogStatus("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setFruits([]);
        setCatalogStatus("error");
        setCatalogError(error instanceof Error ? error.message : "Could not load the stall.");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return (
    <StoreContext.Provider
      value={{ fruits, setFruits, filters, setFilters, catalogStatus, catalogError, reloadCatalog }}
    >
      {children}
    </StoreContext.Provider>
  );
};
