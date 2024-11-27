import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button,
  Image
} from "@nextui-org/react";
import {deleteBook} from "../services/api";
import PropTypes from 'prop-types';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookDetailsModal = ({ isOpen, onClose, book }) => {

  const navigate = useNavigate ();


  BookDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    book: PropTypes.object.isRequired,
  };

  if (!book) return null;

 const  handleDeleteBook = async (id) => {
    try {
    
        await deleteBook(id);
        
        
        toast.success("Book deleted successfully");
        onClose()
        
    } catch (error) {
      toast.error("something went wrong")
        console.error(error)
        throw error
    }

  }



  return (
    <Modal 
      size="2xl" 
      isOpen={isOpen} 
      onClose={onClose} 
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <p className="text-sm text-gray-500">by {book.author}</p>
        </ModalHeader>
        
        <ModalBody className="flex flex-col md:flex-row gap-6 p-6">
          {book.coverPhoto && (
            <div className="md:w-1/3 flex-shrink-0">
              <Image
                src={book.coverPhoto}
                alt={book.title}
                className="w-full rounded-xl object-cover shadow-lg"
                fallbackSrc="/placeholder-book.jpg"
              />
            </div>
          )}
          
          <div className="md:w-2/3 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{book.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-600">Publication Year</h4>
                <p className="text-gray-800">{book.publicationYear}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-600">ISBN</h4>
                <p className="text-gray-800">{book.isbn}</p>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={() => {handleDeleteBook(book._id)}} color="danger">Delete</Button>
          <Button color="primary" variant="light" onPress={()=>{navigate(`/editbook/${book._id}`)}}>
             Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookDetailsModal;