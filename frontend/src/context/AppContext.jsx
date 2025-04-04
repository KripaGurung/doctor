import { createContext, useState } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const [userDetails, setUserDetails] = useState(null)
  const currencySymbol ='Rs'


  const value = {
    doctors,
    currencySymbol,
    userDetails,
    setUserDetails,
  };

  return (
  <AppContext.Provider value={value}>
    {props.children}
  </AppContext.Provider>
  )
}



export default AppContextProvider