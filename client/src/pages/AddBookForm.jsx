import React, { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBookForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publicationYear: "",
    isbn: "",
    description: "",
  });
  const navigate = useNavigate();

  const [file, setFile] = useState(null); // State for the file
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for form errors


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Save the selected file in state
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Book title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.publicationYear) newErrors.publicationYear = "Publication year is required";
    if (!formData.isbn) newErrors.isbn = "ISBN is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!file) newErrors.coverPhoto = "Cover photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent submission if validation fails

    setIsLoading(true);
    toast.loading("uploading")

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
      await onSubmit(formDataToSend);

      // Reset form state after successful submission
      setFormData({
        title: "",
        author: "",
        publicationYear: "",
        isbn: "",
        description: "",
      });
      setFile(null);
      toast.dismiss()
      // Close form (trigger onClose)
      toast("Book added successfully")
      navigate(-1)
    } catch (error) {
      toast.error("something went wrong")
      console.error("Error adding book:", error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">Add New Book</h1>
          <p className="text-blue-100">Fill in the book details below</p>
        </CardHeader>

        <CardBody className="gap-6 px-6 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Book Title */}
              <div>
                <Input
                  type="text"
                  label="Book Title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  variant="bordered"
                  isRequired
                />
                {errors.title && (
                  <p className="text-red-600 mt-1 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <Input
                  type="text"
                  label="Author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  variant="bordered"
                  isRequired
                />
                {errors.author && (
                  <p className="text-red-600 mt-1 text-sm">{errors.author}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Publication Year */}
              <div>
                <Input
                  type="number"
                  label="Publication Year"
                  placeholder="YYYY"
                  value={formData.publicationYear}
                  onChange={(e) =>
                    setFormData({ ...formData, publicationYear: e.target.value })
                  }
                  variant="bordered"
                  isRequired
                />
                {errors.publicationYear && (
                  <p className="text-red-600 mt-1 text-sm">{errors.publicationYear}</p>
                )}
              </div>

              {/* ISBN */}
              <div>
                <Input
                  type="text"
                  label="ISBN"
                  placeholder="Enter ISBN"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  variant="bordered"
                  isRequired
                />
                {errors.isbn && (
                  <p className="text-red-600 mt-1 text-sm">{errors.isbn}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Description"
                placeholder="Enter book description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                variant="bordered"
                isRequired
                minRows={3}
              />
              {errors.description && (
                <p className="text-red-600 mt-1 text-sm">{errors.description}</p>
              )}
            </div>

            {/* File Input for Cover Photo */}
            <div>
              <Input
                type="file"
                label="Cover Photo"
                onChange={handleFileChange}
                variant="bordered"
                isRequired
              />
              {errors.coverPhoto && (
                <p className="text-red-600 mt-1 text-sm">{errors.coverPhoto}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 font-semibold text-white"
              >
                {isLoading ? 'Uploading.....' : "Add Book"}
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

export default AddBookForm;
