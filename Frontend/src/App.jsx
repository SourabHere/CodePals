import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import UserPosts from "./components/UserPosts";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Layout from "./pages/Layout";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/connect" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>

          <Route path="/" element={<Layout />}>
            <Route path="home/dashboard" element={<Dashboard />} />
            <Route path="home/userPosts" element={<UserPosts />} />
            <Route path="home/profile" element={<Profile />} />
            <Route path="home/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
