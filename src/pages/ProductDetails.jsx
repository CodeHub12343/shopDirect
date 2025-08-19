import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProductDetails } from '../features/products/useProductDetails';
import ProductForm from '../components/ProductForm';
import { 
  ArrowLeft, 
  Star, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Download,
  Share2,
  Copy,
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Tag,
  Hash,
  Image as ImageIcon,
  FileText,
  Activity,
  Target,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';

const ProductDetailsContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'};
  padding: 24px;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 12px 0;
  line-height: 1.2;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ProductId = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CategoryBadge = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const StatusBadge = styled.div`
  background: ${props => props.status === 'active' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'active' ? '#166534' : '#991b1b'};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
  
  &.danger {
    &:hover {
          border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
`;

const MainImageContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 12px;
`;

const ImagePlaceholder = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ImageNavigation = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
  pointer-events: none;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: all;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundCard};
    transform: scale(1.1);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const Thumbnail = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const DetailsSection = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
`;

const PriceSection = styled.div`
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const PriceValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const PriceLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 4px;
`;

const RatingText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReviewCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const DescriptionSection = styled.div`
  margin-bottom: 24px;
`;

const DescriptionText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const AnalyticsCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }
`;

const AnalyticsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const AnalyticsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const AnalyticsIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const AnalyticsValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const AnalyticsChange = styled.div`
  font-size: 14px;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ManagementSection = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
  margin-bottom: 32px;
`;

const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ManagementCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundTertiary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ManagementTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 8px 0;
`;

const ManagementValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
`;



const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { product, productAnalytics, isLoading, error } = useProductDetails(productId);

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:5000/img/products/${imagePath}`;
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePreviousImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? (product.images.length - 1) : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex(prev => 
      prev === (product.images.length - 1) ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <ProductDetailsContainer>
        <LoadingContainer>
          <Spinner size="40px" />
          <div>Loading product details...</div>
        </LoadingContainer>
      </ProductDetailsContainer>
    );
  }

  if (error) {
    return (
      <ProductDetailsContainer>
        <BackButton onClick={() => navigate('/products')}>
          <ArrowLeft size={20} />
          Back to Products
        </BackButton>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#ef4444' }}>
          <h2>Error loading product</h2>
          <p>{error.message || 'Something went wrong'}</p>
        </div>
      </ProductDetailsContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailsContainer>
        <BackButton onClick={() => navigate('/products')}>
          <ArrowLeft size={20} />
          Back to Products
        </BackButton>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </ProductDetailsContainer>
    );
  }

  const allImages = [product.imageCover, ...(product.images || [])];
  const currentImage = allImages[currentImageIndex];

  // Use live analytics data from API
  const analyticsData = productAnalytics || {
    totalViews: 0,
    totalSales: 0,
    revenue: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    stockLevel: product?.stockQuantity || 0,
    reorderPoint: Math.ceil((product?.stockQuantity || 0) * 0.2),
    daysInStock: 0
  };

  return (
    <ProductDetailsContainer>
      <BackButton onClick={() => navigate('/products')}>
        <ArrowLeft size={20} />
        Back to Products
      </BackButton>

      <HeaderSection>
        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductMeta>
            <ProductId>
              <Hash size={14} />
              {product._id || product.id}
            </ProductId>
            <CategoryBadge>{product.category?.name || 'Uncategorized'}</CategoryBadge>
            <StatusBadge status="active">
              <CheckCircle size={14} />
              Active
            </StatusBadge>
          </ProductMeta>
        </ProductInfo>
        
        <ActionButtons>
          <PrimaryButton onClick={() => setIsFormOpen(true)}>
            <Edit size={16} />
            Edit Product
          </PrimaryButton>
          <SecondaryButton onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh Data
          </SecondaryButton>
          <SecondaryButton>
            <Eye size={16} />
            Preview
          </SecondaryButton>
          <SecondaryButton>
            <Download size={16} />
            Export
          </SecondaryButton>
          <SecondaryButton className="danger">
            <Trash2 size={16} />
            Delete
          </SecondaryButton>
        </ActionButtons>
      </HeaderSection>

      <MainGrid>
        <ImageSection>
          <SectionTitle>
            <ImageIcon size={20} />
            Product Images
          </SectionTitle>
          
          <MainImageContainer>
            {currentImage ? (
              <MainImage 
                src={getImageUrl(currentImage)} 
                alt={product.name}
              />
            ) : (
              <ImagePlaceholder>
                <ImageIcon size={48} />
              </ImagePlaceholder>
            )}
            {allImages.length > 1 && (
              <ImageNavigation>
                <NavButton onClick={handlePreviousImage}>
                  <ChevronLeft size={20} />
                </NavButton>
                <NavButton onClick={handleNextImage}>
                  <ChevronRight size={20} />
                </NavButton>
              </ImageNavigation>
            )}
          </MainImageContainer>

          {allImages.length > 1 && (
            <ThumbnailGrid>
              {allImages.map((image, index) => (
                <Thumbnail 
                  key={index} 
                  active={index === currentImageIndex}
                  onClick={() => handleImageChange(index)}
                >
                  <ThumbnailImage 
                    src={getImageUrl(image)} 
                    alt={`${product.name} - Image ${index + 1}`}
                  />
                </Thumbnail>
              ))}
            </ThumbnailGrid>
          )}
        </ImageSection>

        <DetailsSection>
          <SectionTitle>
            <FileText size={20} />
            Product Details
          </SectionTitle>
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Product ID</InfoLabel>
              <InfoValue>{product._id || product.id}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Category</InfoLabel>
              <InfoValue>{product.category?.name || 'Uncategorized'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Created Date</InfoLabel>
              <InfoValue>{new Date(product.createdAt).toLocaleDateString()}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Last Updated</InfoLabel>
              <InfoValue>{new Date(product.updatedAt).toLocaleDateString()}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Rating</InfoLabel>
              <InfoValue>{product.ratingsAverage?.toFixed(1) || '0.0'}/5.0</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Total Reviews</InfoLabel>
              <InfoValue>{product.ratingsQuantity?.toLocaleString() || '0'}</InfoValue>
            </InfoItem>
          </InfoGrid>

          <PriceSection>
            <PriceValue>${product.price?.toLocaleString()}</PriceValue>
            <PriceLabel>Current Price</PriceLabel>
          </PriceSection>

          <RatingSection>
            <RatingStars>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < Math.floor(product.ratingsAverage || 0) ? "#fbbf24" : "none"}
                  color="#fbbf24"
                  style={{ color: "#fbbf24" }}
                />
              ))}
            </RatingStars>
            <RatingText>{product.ratingsAverage?.toFixed(1) || '0.0'}</RatingText>
            <ReviewCount>({product.ratingsQuantity?.toLocaleString() || '0'} reviews)</ReviewCount>
          </RatingSection>

          <DescriptionSection>
            <InfoLabel>Description</InfoLabel>
            <DescriptionText>{product.description}</DescriptionText>
          </DescriptionSection>
        </DetailsSection>
      </MainGrid>

      <AnalyticsGrid>
        <AnalyticsCard>
          <AnalyticsHeader>
            <AnalyticsTitle>Total Views</AnalyticsTitle>
            <AnalyticsIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
              <Eye size={20} />
            </AnalyticsIcon>
          </AnalyticsHeader>
          <AnalyticsValue>{analyticsData.totalViews.toLocaleString()}</AnalyticsValue>
          <AnalyticsChange positive>
            <TrendingUp size={14} />
            +12.5% from last month
          </AnalyticsChange>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsHeader>
            <AnalyticsTitle>Total Sales</AnalyticsTitle>
            <AnalyticsIcon bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <ShoppingCart size={20} />
            </AnalyticsIcon>
          </AnalyticsHeader>
          <AnalyticsValue>{analyticsData.totalSales}</AnalyticsValue>
          <AnalyticsChange positive>
            <TrendingUp size={14} />
            +8.2% from last month
          </AnalyticsChange>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsHeader>
            <AnalyticsTitle>Revenue</AnalyticsTitle>
            <AnalyticsIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <DollarSign size={20} />
            </AnalyticsIcon>
          </AnalyticsHeader>
          <AnalyticsValue>${analyticsData.revenue.toLocaleString()}</AnalyticsValue>
          <AnalyticsChange positive>
            <TrendingUp size={14} />
            +15.3% from last month
          </AnalyticsChange>
        </AnalyticsCard>

        <AnalyticsCard>
          <AnalyticsHeader>
            <AnalyticsTitle>Conversion Rate</AnalyticsTitle>
            <AnalyticsIcon bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
              <Target size={20} />
            </AnalyticsIcon>
          </AnalyticsHeader>
          <AnalyticsValue>{analyticsData.conversionRate}%</AnalyticsValue>
          <AnalyticsChange positive>
            <TrendingUp size={14} />
            +2.1% from last month
          </AnalyticsChange>
        </AnalyticsCard>
      </AnalyticsGrid>

      <ManagementSection>
        <SectionTitle>
          <Settings size={20} />
          Inventory Management
        </SectionTitle>
        
        <ManagementGrid>
          <ManagementCard>
            <ManagementTitle>Current Stock</ManagementTitle>
            <ManagementValue>{analyticsData.stockLevel}</ManagementValue>
          </ManagementCard>
          
          <ManagementCard>
            <ManagementTitle>Reorder Point</ManagementTitle>
            <ManagementValue>{analyticsData.reorderPoint}</ManagementValue>
          </ManagementCard>
          
          <ManagementCard>
            <ManagementTitle>Days in Stock</ManagementTitle>
            <ManagementValue>{analyticsData.daysInStock}</ManagementValue>
          </ManagementCard>
          
          <ManagementCard>
            <ManagementTitle>Avg Order Value</ManagementTitle>
            <ManagementValue>${analyticsData.avgOrderValue}</ManagementValue>
          </ManagementCard>
        </ManagementGrid>
      </ManagementSection>

      <ProductForm
        isOpen={isFormOpen}
        productToEdit={product}
        onCloseModal={() => setIsFormOpen(false)}
      />
    </ProductDetailsContainer>
  );
};

export default ProductDetails; 