import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import ProtoTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { getBook } from "../services/api";
import toast from "react-hot-toast";

const EditBookForm = ({ onSubmit }) => {
  EditBookForm.propTypes = {
    onSubmit: ProtoTypes.func.isRequired,
  };

  const { id } = useParams();

  useEffect(() => {
    fetchBook();
  }, []);

  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const [file, setFile] = useState(null); // State for the file
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Save the selected file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData to handle text + file
      const formDataToSend = new FormData();

      // Append text fields
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Append the file
      if (file) {
        formDataToSend.append("coverPhoto", file);
      }

      // Call the onSubmit function with FormData
      await onSubmit(formDataToSend, formData._id);

      // Show success message
      toast.success("Book updated successfully");

      // Reset form state
      setFormData({
        title: "",
        author: "",
        publicationYear: "",
        isbn: "",
        description: "",
      });

      setFile(null);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the book.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBook = async () => {
    try {
      const response = await getBook(id);

      console.log("===============sddfg=====================");
      console.log(response);
      console.log("====================================");

      setFormData(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">Edit Book</h1>
          <p className="text-blue-100">Fill in the book details below</p>
        </CardHeader>

        <CardBody className="gap-6 px-6 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Other Input Fields */}
              <Input
                type="text"
                label="Book Title"
                placeholder="Enter book title"
                value={formData?.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                variant="bordered"
                isRequired
              />
              <Input
                type="text"
                label="Author"
                placeholder="Enter author name"
                value={formData?.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                variant="bordered"
                isRequired
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                type="number"
                label="Publication Year"
                placeholder="YYYY"
                value={formData?.publicationYear}
                onChange={(e) =>
                  setFormData({ ...formData, publicationYear: e.target.value })
                }
                variant="bordered"
                isRequired
                classNames={{
                  label: "text-gray-600",
                  input: "text-gray-800",
                }}
              />

              <Input
                type="text"
                label="ISBN"
                placeholder="Enter ISBN"
                value={formData?.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                variant="bordered"
                isRequired
                classNames={{
                  label: "text-gray-600",
                  input: "text-gray-800",
                }}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Enter book description"
              value={formData?.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              variant="bordered"
              isRequired
              minRows={3}
              classNames={{
                label: "text-gray-600",
                input: "text-gray-800",
              }}
            />
            {/* File Input for Cover Photo */}
            <Input
              type="file"
              label="Cover Photo"
              onChange={handleFileChange}
              variant="bordered"
              isRequired
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 font-semibold text-white"
              >
                Edit Book
              </Button>
              <Button
                type="button"
                variant="bordered"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setFormData({
                    title: "",
                    author: "",
                    publicationYear: "",
                    isbn: "",
                    description: "",
                  });
                  setFile(null);
                }}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditBookForm;
