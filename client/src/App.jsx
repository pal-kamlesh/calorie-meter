import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Home, SignIn, SignUp } from "./pages";
import { Header, PrivateRoute } from "./components/index.js";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
