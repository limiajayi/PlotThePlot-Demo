import ProfilePage from "./components/pages/ProfilePage"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {
  return (
      <div>
          
        <BrowserRouter>
          <Routes>
            <Route path="/users/:userId/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App