import React, { createContext, useContext } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ value, children }) => {
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useFabricOverlayState = () => useContext(StoreContext);
