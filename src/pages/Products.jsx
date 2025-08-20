import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProductForm from '../components/ProductForm';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Package,
  TrendingUp,
  DollarSign,
  Loader2
} from 'lucide-react';
import { useGetProducts } from '../features/products/useGetProducts';
import useGetCategories from '../features/products/useGetCategories';
import { useToast } from '../contexts/ToastContext';
import { getToastMessage, getErrorMessage } from '../utils/toastMessages';
import { deleteProduct } from '../services/apiProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from '../components/ui/Spinner';

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const FiltersSection = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 24px;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundCard};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 18px;
  height: 18px;
`;

const FilterButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  opacity: ${props => props.isOptimistic ? 0.7 : 1};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' 
    : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ProductImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-direction: column;
  gap: 4px;
`;

const RetryButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  color: #3b82f6;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    transform: scale(1.05);
  }
`;

const ProductImageCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 12px;
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.type === 'featured' ? '#fbbf24' : '#10b981'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const ProductContent = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const ProductCategory = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 12px 0;
`;

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
`;

const ProductStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  &.danger {
    &:hover {
      border-color: ${({ theme }) => theme.colors.error};
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor};
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.colors.primary};
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: ${({ theme }) => theme.colors.error};
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Pagination styled components
const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  gap: 4px;
`;

const PageNumber = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.backgroundCard};
  color: ${props => props.active ? 'white' : props.theme.colors.textPrimary};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(.active) {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PaginationLimit = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Helper function to get unique categories from available categories
const getUniqueCategories = (categories) => {
  if (!categories || categories.length === 0) return [{ id: 'all', name: 'All Categories' }];
  return [
    { id: 'all', name: 'All Categories' }, 
    ...categories.map(cat => ({
      id: cat._id || cat.id,
      name: cat.name
    }))
  ];
};

const Products = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [imageLoading, setImageLoading] = useState(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const { liveProducts, isLoading, error } = useGetProducts(page, searchQuery, selectedCategory, sortBy, limit);
  const { categories: availableCategories } = useGetCategories();
  const { success, error: showError } = useToast();
  console.log('Products data:', liveProducts);
  console.log('Available categories:', availableCategories);
  console.log('Selected category:', selectedCategory);
  
  // Helper function to get full image URL
 /*  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `https://shopdirect-api.onrender.com/${imagePath}`;
  }; */
  
  // Handle image load start
  const handleImageLoadStart = (productId) => {
    setImageLoading(prev => new Set(prev).add(productId));
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  // Handle image load success
  const handleImageLoadSuccess = (productId) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  // Handle image load error
  const handleImageError = (productId) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    // Add a small delay before marking image as failed
    // This helps with newly created products where image might not be immediately available
    setTimeout(() => {
      setImageErrors(prev => new Set(prev).add(productId));
    }, 2000); // 2 second delay
  };

  // Clear image errors for a specific product (when it's successfully created/updated)
  const clearImageError = (productId) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };



  // Handle form actions
  const handleOpenCreateForm = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  };

  // React Query mutation for delete with optimistic updates
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (productId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(['products']);

      // Optimistically update to the new value
      queryClient.setQueryData(['products'], (old) => {
        if (!old) return old;
        return old.filter(product => product._id !== productId);
      });

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (err, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      console.error("Error deleting product:", err);
      const message = getErrorMessage('product', 'delete', err.message);
      showError(message.title, message.message);
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['products'] });
      const message = getToastMessage('product', 'delete', 'success');
      success(message.title, message.message);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProductMutation.mutate(product._id);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  // Reset page when search or filters change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <ProductsContainer>
        <PageTitle>Products</PageTitle>
        <LoadingContainer>
          <LoadingSpinner size={32} />
          <div>Loading products...</div>
        </LoadingContainer>
      </ProductsContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ProductsContainer>
        <PageTitle>Products</PageTitle>
        <ErrorContainer>
          <div>Error loading products</div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            {error.message || 'Something went wrong'}
          </div>
        </ErrorContainer>
      </ProductsContainer>
    );
  }

  // Use live products data with pagination
  const products = liveProducts?.products || [];
  const totalProducts = liveProducts?.total || 0;
  const totalPages = liveProducts?.totalPages || 1;
  const currentPage = liveProducts?.page || 1;
  const resultsPerPage = liveProducts?.results || 0;

  // No need for client-side filtering since backend handles it
  const filteredProducts = products;

  const categories = getUniqueCategories(availableCategories || []);

  return (
    <>
      <ProductsContainer>
        <PageHeader>
          <PageTitle>Products</PageTitle>
          <AddButton onClick={handleOpenCreateForm}>
            <Plus size={18} />
            Add Product
          </AddButton>
        </PageHeader>

      <StatsCards>
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <Package size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{totalProducts}</StatValue>
            <StatLabel>Total Products</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{products?.reduce((sum, product) => sum + (product.ratingsQuantity || 0), 0) || 0}</StatValue>
            <StatLabel>Total Reviews</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
            <Star size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>
              {products && products.length > 0 
                ? (products.reduce((sum, product) => sum + (product.ratingsAverage || 0), 0) / products.length).toFixed(1)
                : '0.0'
              }
            </StatValue>
            <StatLabel>Avg Rating</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>
              ${products?.reduce((sum, product) => sum + (product.price || 0), 0)?.toLocaleString() || '0'}
            </StatValue>
            <StatLabel>Total Value</StatLabel>
          </StatContent>
        </StatCard>
      </StatsCards>

      <FiltersSection>
        <FiltersRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search products... (Coming soon)"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled
            />
          </SearchContainer>
          
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          
          <Select value={sortBy} onChange={handleSortChange}>
            <option value="name">Sort by Name</option>
            <option value="-name">Sort by Name (Z-A)</option>
            <option value="price">Sort by Price (Low to High)</option>
            <option value="-price">Sort by Price (High to Low)</option>
            <option value="createdAt">Sort by Date (Oldest First)</option>
            <option value="-createdAt">Sort by Date (Newest First)</option>
          </Select>
          
          <FilterButton>
            <Filter size={16} />
            More Filters
          </FilterButton>
        </FiltersRow>
      </FiltersSection>

      {!filteredProducts || filteredProducts.length === 0 ? (
        <EmptyContainer>
          <Package size={48} color="#94a3b8" />
          <div>No products found</div>
          <div style={{ fontSize: '14px' }}>
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No products available yet'
            }
          </div>
        </EmptyContainer>
      ) : (
        <ProductsGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} isOptimistic={product.__isOptimistic}>
              <ProductImage>
                {product.imageCover && !imageErrors.has(product._id || product.id) ? (
                  <ProductImageCover 
                    src={product.imageCoverUrl || `https://shopdirect-api.onrender.com/img/products/${product.imageCover}`}
                    alt={product.name}
                    onLoadStart={() => handleImageLoadStart(product._id || product.id)}
                    onLoad={() => handleImageLoadSuccess(product._id || product.id)}
                    onError={() => handleImageError(product._id || product.id)}
                  />
                ) : null}
                <ProductImagePlaceholder style={{ display: (product.imageCover && !imageErrors.has(product._id || product.id) && !imageLoading.has(product._id || product.id)) ? 'none' : 'flex' }}>
                  {imageLoading.has(product._id || product.id) ? (
                    <Spinner size="24px" />
                  ) : (
                    <>
                      <Package size={32} />
                      {product.imageCover && imageErrors.has(product._id || product.id) && (
                        <RetryButton onClick={() => clearImageError(product._id || product.id)}>
                          Retry
                        </RetryButton>
                      )}
                    </>
                  )}
                </ProductImagePlaceholder>
                {product.ratingsAverage >= 4.8 && (
                  <ProductBadge type="featured">
                    Top Rated
                  </ProductBadge>
                )}
              </ProductImage>
              
              <ProductContent>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductCategory>{product.category?.name || 'Uncategorized'}</ProductCategory>
                <ProductPrice>${product.price?.toLocaleString()}</ProductPrice>
                
                <ProductStats>
                  <Stat>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    {product.ratingsAverage?.toFixed(1) || '0.0'}
                  </Stat>
                  <Stat>
                    <TrendingUp size={14} />
                    {product.ratingsQuantity || 0} reviews
                  </Stat>
                  <Stat>
                    <Package size={14} />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </Stat>
                </ProductStats>
                
                              <ProductActions>
                <ActionButton onClick={() => navigate(`/products/${product._id || product.id}`)}>
                  <Eye size={14} />
                  View
                </ActionButton>
                <ActionButton onClick={() => handleOpenEditForm(product)}>
                  <Edit size={14} />
                  Edit
                </ActionButton>
                <ActionButton 
                  className="danger"
                  onClick={() => handleDeleteProduct(product)}
                  disabled={deleteProductMutation.isPending}
                >
                  {deleteProductMutation.isPending ? (
                    <>
                      <Spinner size="14px" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
                  )}
                </ActionButton>
              </ProductActions>
              </ProductContent>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            Showing {resultsPerPage} of {totalProducts} products
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            
            <PageNumbers>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PageNumber
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    active={pageNum === currentPage}
                  >
                    {pageNum}
                  </PageNumber>
                );
              })}
            </PageNumbers>
            
            <PaginationButton 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationControls>
          
          <PaginationLimit>
            <span>Show:</span>
            <Select 
              value={limit} 
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              style={{ width: '80px', marginLeft: '8px' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
            <span style={{ marginLeft: '8px' }}>per page</span>
          </PaginationLimit>
        </PaginationContainer>
      )}
      </ProductsContainer>

      <ProductForm
        isOpen={isFormOpen}
        productToEdit={productToEdit}
        onCloseModal={handleCloseForm}
        onProductSuccess={clearImageError}
      />
    </>
  );
};

export default Products; 