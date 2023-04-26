import "./App.css";
import { MuiContainer } from "./components";
import { HomeScreen, ProfileScreen } from "./screens";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <MuiContainer>
      <Routes>
        <Route path="/" element={<HomeScreen/>} />
        <Route path="/user/{id}" element={<ProfileScreen/>} />
      </Routes>
    </MuiContainer>
  );
}

export default App;
