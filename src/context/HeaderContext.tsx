// context/HeaderContext.tsx


// import React, { createContext, useContext, useState } from 'react';

// interface HeaderContextType {
//   hideHeader: boolean;
//   setHideHeader: (hide: boolean) => void;
// }

// const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// export const useHeaderContext = () => {
//   const context = useContext(HeaderContext);
//   if (!context) {
//     throw new Error(
//       'useHeaderContext must be used within a HeaderContextProvider',
//     );
//   }
//   return context;
// };

// export const HeaderContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [hideHeader, setHideHeader] = useState(false);

//   return (
//     <HeaderContext.Provider value={{ hideHeader, setHideHeader }}>
//       {children}
//     </HeaderContext.Provider>
//   );
// };
