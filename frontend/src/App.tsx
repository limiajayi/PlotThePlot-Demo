import ProfilePage from "./pages/ProfilePage"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {
  return (
      <div>
        <p>My Nothing App</p>
        <BrowserRouter>
          <Routes>
            <Route path="/users/:userId/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App