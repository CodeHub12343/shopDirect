/* import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Save, Package } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
`;

const FormContainer = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const FormTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-textSecondary);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    background: var(--color-gray-100);
    color: var(--color-text);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
`;

const ProductForm = ({ isOpen, onClose, product, categories, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageCover: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || product.category || '',
        stock: product.stock || '',
        imageCover: product.imageCover || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageCover: ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const categoryOptions = categories?.map(cat => ({
    value: cat._id || cat.id || cat.value,
    label: cat.name || cat.label
  })) || [];

  return (
    <FormOverlay onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <FormHeader>
          <FormTitle>
            {product ? 'Edit Product' : 'Create New Product'}
          </FormTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text)' }}>
                Product Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text)' }}>
                Price
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text)' }}>
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text)' }}>
                Stock
              </label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                min="0"
              />
            </div>
          </FormGrid>

          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text)' }}>
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-text)' }}>
              Image URL
            </label>
            <Input
              name="imageCover"
              value={formData.imageCover}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <FormActions>
            <Button type="button" variation="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save size={18} />
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </FormActions>
        </form>
      </FormContainer>
    </FormOverlay>
  );
};

export default ProductForm;  */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save, Plus } from 'lucide-react';
import styled from "styled-components";
import { useToast } from "../contexts/ToastContext";

import Form from "./ui/Form";
import { FormRow } from "./ui/Form";
import Input from "./ui/Input";
import FileInput from "./ui/FileInput";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import Select from "./ui/Select";
import { createProduct, updateProduct } from "../services/apiProduct";
import { getToastMessage, getErrorMessage } from "../utils/toastMessages";
import useGetCategories from "../features/products/useGetCategories";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px; /* Reduced from 20px */
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px; /* Reduced from 16px */
  padding: 24px; /* Reduced from 32px */
  max-width: 600px; /* Reduced from 800px */
  width: 100%;
  max-height: 85vh; /* Reduced from 90vh */
  overflow-y: auto;
  position: relative;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; /* Reduced from 24px */
  padding-bottom: 12px; /* Reduced from 16px */
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 20px; /* Reduced from 24px */
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px; /* Reduced from 24px */
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthRow = styled.div`
  grid-column: 1 / -1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px; /* Reduced from 12px */
  justify-content: flex-end;
  margin-top: 24px; /* Reduced from 32px */
  padding-top: 16px; /* Reduced from 24px */
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ErrorMessage = styled.span`
  font-size: 11px; /* Reduced from 12px */
  color: ${({ theme }) => theme.colors.error};
  margin-top: 3px; /* Reduced from 4px */
`;

export default function ProductForm({ productToEdit = null, onCloseModal, isOpen }) {
  const isEdit = Boolean(productToEdit?._id);
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  
  // Fetch categories using the new hook
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      imageCover: null,
      images: null
    }
  });

  // Handle file changes for react-hook-form
  const handleFileChange = (field, files) => {
    setValue(field, files);
  };

  // Initialize form data when editing
  useEffect(() => {
    if (isEdit && productToEdit) {
      reset({
        name: productToEdit?.name || "",
        description: productToEdit?.description || "",
        price: productToEdit?.price || 0,
        category: productToEdit?.category?._id || "",
        imageCover: null,
        images: null
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        category: "",
        imageCover: null,
        images: null
      });
    }
  }, [isEdit, productToEdit, reset]);



  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onMutate: async (newProduct) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(['products']);

      // Create a temporary product object for optimistic update
      const optimisticProduct = {
        _id: `temp-${Date.now()}`,
        ...newProduct,
        createdAt: new Date().toISOString(),
        ratingsAverage: 0,
        ratingsQuantity: 0,
        // Add a temporary flag to identify this as an optimistic update
        __isOptimistic: true
      };

      // Optimistically update to the new value
      queryClient.setQueryData(['products'], (old) => {
        if (!old) return [optimisticProduct];
        return [optimisticProduct, ...old];
      });

      // Return a context object with the snapshotted value
      return { previousProducts, optimisticProduct };
    },
    onError: (err, newProduct, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      console.error("Error creating product:", err);
      const message = getErrorMessage('product', 'create', err.message);
      showError(message.title, message.message);
    },
    onSuccess: (createdProduct) => {
      // Replace the optimistic product with the real one
      queryClient.setQueryData(['products'], (old) => {
        if (!old) return [createdProduct];
        return old.map(product => 
          product.__isOptimistic ? createdProduct : product
        );
      });
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onCloseModal?.();
      const message = getToastMessage('product', 'create', 'success');
      success(message.title, message.message);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onMutate: async ({ productId, productData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['product', productId] });

      // Snapshot the previous values
      const previousProducts = queryClient.getQueryData(['products']);
      const previousProduct = queryClient.getQueryData(['product', productId]);

      // Create an optimistic product object
      const optimisticProduct = {
        ...productToEdit,
        ...productData,
        __isOptimistic: true
      };

      // Optimistically update products list
      queryClient.setQueryData(['products'], (old) => {
        if (!old) return old;
        return old.map(product => 
          product._id === productId ? optimisticProduct : product
        );
      });

      // Optimistically update individual product
      queryClient.setQueryData(['product', productId], optimisticProduct);

      // Return a context object with the snapshotted values
      return { previousProducts, previousProduct, optimisticProduct };
    },
    onError: (err, { productId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', productId], context.previousProduct);
      }
      console.error("Error updating product:", err);
      const message = getErrorMessage('product', 'update', err.message);
      showError(message.title, message.message);
    },
    onSuccess: (updatedProduct, { productId }) => {
      // Replace the optimistic product with the real one
      queryClient.setQueryData(['products'], (old) => {
        if (!old) return old;
        return old.map(product => 
          product._id === productId ? updatedProduct : product
        );
      });
      
      queryClient.setQueryData(['product', productId], updatedProduct);
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (productToEdit?._id) {
        queryClient.invalidateQueries({ queryKey: ['product', productToEdit._id] });
      }
      onCloseModal?.();
      const message = getToastMessage('product', 'update', 'success');
      success(message.title, message.message);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (productToEdit?._id) {
        queryClient.invalidateQueries({ queryKey: ['product', productToEdit._id] });
      }
    },
  });

  const onSubmit = (data) => {
    // Custom validation for file inputs
    if (!isEdit && (!data.imageCover || data.imageCover.length === 0)) {
      setValue("imageCover", null, { shouldValidate: true });
      return;
    }

    if (isEdit && productToEdit?._id) {
      updateProductMutation.mutate({
        productId: productToEdit._id,
        productData: data
      });
    } else {
      createProductMutation.mutate(data);
    }
  };

  // Check if any mutation is in progress
  const isMutationPending = createProductMutation.isPending || updateProductMutation.isPending;

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCloseModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isEdit ? "Edit Product" : "Create New Product"}
          </ModalTitle>
          <CloseButton onClick={onCloseModal}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGrid>
            <FormRow label="Product Name" error={errors.name?.message}>
              <Input
                {...register("name", {
                  required: "Product name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Maximum 100 characters"
                  }
                })}
                placeholder="Enter product name"
                disabled={isSubmitting}
              />
            </FormRow>

            <FormRow label="Category" error={errors.category?.message || categoriesError?.message}>
              <Select
                {...register("category", {
                  required: "Category is required"
                })}
                disabled={isSubmitting || categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow label="Price" error={errors.price?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be positive"
                  },
                  valueAsNumber: true
                })}
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </FormRow>

            <FormRow label="Cover Image" error={errors.imageCover?.message}>
              <FileInput
                onChange={(files) => handleFileChange("imageCover", files)}
                value={watch("imageCover")}
                accept="image/*"
                disabled={isSubmitting}
              />
              {!isEdit && (!watch("imageCover") || watch("imageCover").length === 0) && (
                <ErrorMessage>Cover image is required for new products</ErrorMessage>
              )}
            </FormRow>

            <FullWidthRow>
              <FormRow label="Description" error={errors.description?.message}>
                <Textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Minimum 10 characters"
                    },
                    maxLength: {
                      value: 1000,
                      message: "Maximum 1000 characters"
                    }
                  })}
                  placeholder="Enter product description..."
                  disabled={isSubmitting}
                  rows={4}
                />
              </FormRow>
            </FullWidthRow>

            <FullWidthRow>
              <FormRow label="Additional Images">
                <FileInput
                  onChange={(files) => handleFileChange("images", files)}
                  value={watch("images")}
                  multiple
                  accept="image/*"
                  disabled={isSubmitting}
                />
              </FormRow>
            </FullWidthRow>
          </FormGrid>

          <ButtonGroup>
            <Button
              type="button"
              variation="secondary"
              onClick={onCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isMutationPending}
            >
              {isSubmitting || isMutationPending ? (
                <>
                  <div className="spinner" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEdit ? <Save size={16} /> : <Plus size={16} />}
                  {isEdit ? "Update Product" : "Create Product"}
                </>
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 