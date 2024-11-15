import React from "react";
import { UserProvider } from "./context/UserContext";
import UserProfile from "./UserProfile";

function App() {
  return (
    <UserProvider>
      <UserProfile />
    </UserProvider>
  );
}

export default App;
