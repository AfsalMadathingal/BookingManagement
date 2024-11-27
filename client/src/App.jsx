import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AddBookForm from "./pages/AddBookForm";
import { addBook, updateBook } from "./services/api";
import { Toaster } from "react-hot-toast";
import EditBookForm from "./pages/EditBookForm";


function App() {


  return (
    <>
      <div className="bg-gradient-to-r from-black to-gray-900  overflow-hidden">
      <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addbook" element={<AddBookForm onSubmit={(data) => {addBook(data)}} />} />
          <Route path="/editbook/:id" element={<EditBookForm onSubmit={(data,id) => {updateBook(data,id)}} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
