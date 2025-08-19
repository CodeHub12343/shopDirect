import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  Eye, 
  Edit, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertCircle,
  DollarSign,
  ShoppingCart,
  User,
  MapPin,
  CreditCard,
  Package,
  Calendar,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Download,
  Share2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { useGetOrderById, useDeliverOrder } from '../features/orders/useGetOrder';

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderId = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const OrderDate = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.primary {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &.success {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.success} 0%, ${({ theme }) => theme.colors.successDark} 100%);
    color: white;
    border-color: ${({ theme }) => theme.colors.success};
  }
  
  &.toggle {
    position: relative;
    background: ${({ theme }) => theme.isDark ? '#0f172a' : '#f8fafc'};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 10px 14px;
  }
`;

const ToggleDot = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: ${({ active }) => (active ? '#10b981' : '#e5e7eb')};
  transition: all 0.2s ease;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
      case 'shipped': return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
      case 'processing': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'pending': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'cancelled': return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
      default: return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return '#166534';
      case 'shipped': return '#1e40af';
      case 'processing': return '#92400e';
      case 'pending': return '#92400e';
      case 'cancelled': return '#991b1b';
      default: return '#374151';
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const ProductCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundCard};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' 
    : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
`;

const ProductImageCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProductImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ProductCategory = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ProductQuantity = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 500;
`;

const ProductImages = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const ProductThumbnail = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProductThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
`;

const UserPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserPhotoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ShippingAddress = styled.div`
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AddressText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
`;

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const PaymentDetails = styled.div`
  flex: 1;
`;

const PaymentLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PaymentValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  
  &.total {
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    padding-top: 16px;
    font-weight: 700;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 16px;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 40px;
    bottom: -16px;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const TimelineIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? 'white' : '#9ca3af'};
  flex-shrink: 0;
  z-index: 1;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const TimelineTime = styled.div`
  font-size: 12px;
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



const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: ${({ theme }) => theme.colors.error};
`;

// Helper function to get order status
const getOrderStatus = (order) => {
  if (order.isDelivered) return 'delivered';
  if (order.paymentStatus === 'paid') return 'shipped';
  if (order.paymentStatus === 'pending') return 'pending';
  return 'processing';
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered': return <CheckCircle size={20} />;
    case 'shipped': return <Truck size={20} />;
    case 'processing': return <Clock size={20} />;
    case 'pending': return <AlertCircle size={20} />;
    default: return <Clock size={20} />;
  }
};

// Helper function to get image URL
const getImageUrl = (imagePath, type = 'products') => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `http://127.0.0.1:5000/img/${type}/${imagePath}`;
};

// Helper function to get user initials
const getUserInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, isLoading, error } = useGetOrderById(orderId);
  const { mutate: markDelivered, isLoading: isDelivering } = useDeliverOrder(orderId);
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    customer: true,
    shipping: true,
    payment: true,
    timeline: true
  });
  const [imageErrors, setImageErrors] = useState(new Set());
  const [userPhotoError, setUserPhotoError] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <OrderDetailsContainer>
        <LoadingContainer>
          <Spinner size="40px" />
          <div>Loading order details...</div>
        </LoadingContainer>
      </OrderDetailsContainer>
    );
  }

  if (error) {
    return (
      <OrderDetailsContainer>
        <ErrorContainer>
          <div>Error loading order details</div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            {error.message || 'Something went wrong'}
          </div>
        </ErrorContainer>
      </OrderDetailsContainer>
    );
  }

  if (!order) {
    return (
      <OrderDetailsContainer>
        <ErrorContainer>
          <div>Order not found</div>
        </ErrorContainer>
      </OrderDetailsContainer>
    );
  }

  const orderStatus = getOrderStatus(order);
  const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  console.log(order);
  console.log(order?.user?.photo);

  return (
    <OrderDetailsContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BackButton onClick={() => navigate('/orders')}>
            <ArrowLeft size={16} />
            Back to Orders
          </BackButton>
          <OrderInfo>
            <OrderId>Order #{order._id.slice(-8)}</OrderId>
            <OrderDate>Placed on {formatDate(order.createdAt)}</OrderDate>
          </OrderInfo>
        </div>
        <ActionButtons>
          <ActionButton>
            <Download size={16} />
            Export
          </ActionButton>
          <ActionButton>
            <Share2 size={16} />
            Share
          </ActionButton>
          {!order.isDelivered && (
            <ActionButton
              className="toggle"
              onClick={() => markDelivered()}
              disabled={isDelivering}
              aria-pressed={order.isDelivered}
              title={order.isDelivered ? 'Delivered' : 'Mark as delivered'}
            >
              <ToggleDot active={order.isDelivered} />
              {isDelivering ? 'Updating...' : (order.isDelivered ? 'Delivered' : 'Mark as delivered')}
            </ActionButton>
          )}
        </ActionButtons>
      </Header>

      <MainContent>
        <LeftColumn>
          {/* Order Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Package size={20} />
                Order Status
              </CardTitle>
              <StatusBadge status={orderStatus}>
                {orderStatus}
              </StatusBadge>
            </CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {getStatusIcon(orderStatus)}
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                  {orderStatus === 'delivered' ? 'Order Delivered' : 
                   orderStatus === 'shipped' ? 'Order Shipped' :
                   orderStatus === 'processing' ? 'Order Processing' : 'Payment Pending'}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {orderStatus === 'delivered' ? 'Your order has been successfully delivered' :
                   orderStatus === 'shipped' ? 'Your order is on its way' :
                   orderStatus === 'processing' ? 'We are preparing your order' : 'Awaiting payment confirmation'}
                </div>
              </div>
            </div>
          </Card>

          {/* Products Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <ShoppingCart size={20} />
                Order Items ({totalItems})
              </CardTitle>
              <ActionButton onClick={() => toggleSection('products')}>
                {expandedSections.products ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </ActionButton>
            </CardHeader>
                         {expandedSections.products && (
                 <ProductGrid>
                  {order.orderItems?.map((item) => {
                    const product = item?.product || null;
                    const hasCover = !!product?.imageCover;
                    return (
                      <ProductCard key={item._id}>
                        <ProductImage>
                          {hasCover && !imageErrors.has(item._id) ? (
                            <ProductImageCover
                              src={getImageUrl(product.imageCover)}
                              alt={product?.name || 'Product image'}
                              onError={() => setImageErrors(prev => new Set(prev).add(item._id))}
                            />
                          ) : (
                            <ProductImagePlaceholder>
                              <Package size={32} />
                            </ProductImagePlaceholder>
                          )}
                        </ProductImage>
                        <ProductInfo>
                          <ProductName>{product?.name || 'Unknown product'}</ProductName>
                          <ProductCategory>{product?.category?.name || 'Uncategorized'}</ProductCategory>

                          {typeof product?.ratingsAverage === 'number' && (
                            <ProductRating>
                              <Star size={12} fill="#fbbf24" color="#fbbf24" />
                              {product.ratingsAverage.toFixed(1)}
                            </ProductRating>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ProductPrice>${(item.price ?? 0).toLocaleString()}</ProductPrice>
                            <ProductQuantity>Qty: {item.quantity ?? 0}</ProductQuantity>
                          </div>

                          {Array.isArray(product?.images) && product.images.length > 0 && (
                            <ProductImages>
                              {product.images.slice(0, 3).map((image, index) => (
                                <ProductThumbnail key={index}>
                                  {!imageErrors.has(`${item._id}-${index}`) && image ? (
                                    <ProductThumbnailImage
                                      src={getImageUrl(image)}
                                      alt={`${product?.name || 'Product'} ${index + 1}`}
                                      onError={() => setImageErrors(prev => new Set(prev).add(`${item._id}-${index}`))}
                                    />
                                  ) : (
                                    <ProductThumbnailPlaceholder>
                                      {index + 1}
                                    </ProductThumbnailPlaceholder>
                                  )}
                                </ProductThumbnail>
                              ))}
                            </ProductImages>
                          )}
                        </ProductInfo>
                      </ProductCard>
                    );
                  })}
                </ProductGrid>
             )}
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock size={20} />
                Order Timeline
              </CardTitle>
              <ActionButton onClick={() => toggleSection('timeline')}>
                {expandedSections.timeline ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </ActionButton>
            </CardHeader>
            {expandedSections.timeline && (
              <Timeline>
                <TimelineItem>
                  <TimelineIcon active={true}>
                    <CheckCircle size={20} />
                  </TimelineIcon>
                  <TimelineContent>
                    <TimelineTitle>Order Placed</TimelineTitle>
                    <TimelineTime>{formatDate(order.createdAt)}</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
                
                <TimelineItem>
                  <TimelineIcon active={orderStatus !== 'pending'}>
                    <CreditCard size={20} />
                  </TimelineIcon>
                  <TimelineContent>
                    <TimelineTitle>Payment {order.paymentStatus === 'pending' ? 'Pending' : 'Confirmed'}</TimelineTitle>
                    <TimelineTime>
                      {order.paymentStatus === 'pending' ? 'Awaiting payment' : formatDate(order.updatedAt)}
                    </TimelineTime>
                  </TimelineContent>
                </TimelineItem>
                
                <TimelineItem>
                  <TimelineIcon active={orderStatus === 'shipped' || orderStatus === 'delivered'}>
                    <Truck size={20} />
                  </TimelineIcon>
                  <TimelineContent>
                    <TimelineTitle>Order Shipped</TimelineTitle>
                    <TimelineTime>
                      {orderStatus === 'shipped' || orderStatus === 'delivered' ? 'In transit' : 'Not yet shipped'}
                    </TimelineTime>
                  </TimelineContent>
                </TimelineItem>
                
                <TimelineItem>
                  <TimelineIcon active={orderStatus === 'delivered'}>
                    <CheckCircle size={20} />
                  </TimelineIcon>
                  <TimelineContent>
                    <TimelineTitle>Order Delivered</TimelineTitle>
                    <TimelineTime>
                      {orderStatus === 'delivered' ? 'Successfully delivered' : 'Not yet delivered'}
                    </TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            )}
          </Card>
        </LeftColumn>

        <RightColumn>
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <User size={20} />
                Customer Information
              </CardTitle>
              <ActionButton onClick={() => toggleSection('customer')}>
                {expandedSections.customer ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </ActionButton>
            </CardHeader>
                         {expandedSections.customer && (
               <CustomerInfo>
                 <InfoRow>
                   <InfoIcon>
                     {order.user.photo && !userPhotoError ? (
                       <UserPhoto 
                         /* src={getImageUrl(order.user.photo, 'users')} */
                         src={`http://localhost:5000/img/users/${order?.user?.photo}`}
                         alt={order.user.name}
                         onError={() => setUserPhotoError(true)}
                       />
                     ) : (
                       <UserPhotoPlaceholder>
                         {getUserInitials(order.user.name)}
                       </UserPhotoPlaceholder>
                     )}
                   </InfoIcon>
                   <InfoContent>
                     <InfoLabel>Customer Name</InfoLabel>
                     <InfoValue>{order.user.name}</InfoValue>
                   </InfoContent>
                 </InfoRow>
                 
                 <InfoRow>
                   <InfoIcon>
                     <Mail size={20} />
                   </InfoIcon>
                   <InfoContent>
                     <InfoLabel>Email Address</InfoLabel>
                     <InfoValue>{order.user.email}</InfoValue>
                   </InfoContent>
                 </InfoRow>
                 
                 <InfoRow>
                   <InfoIcon>
                     <Calendar size={20} />
                   </InfoIcon>
                   <InfoContent>
                     <InfoLabel>Customer Since</InfoLabel>
                     <InfoValue>Member</InfoValue>
                   </InfoContent>
                 </InfoRow>
               </CustomerInfo>
             )}
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin size={20} />
                Shipping Address
              </CardTitle>
              <ActionButton onClick={() => toggleSection('shipping')}>
                {expandedSections.shipping ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </ActionButton>
            </CardHeader>
            {expandedSections.shipping && (
              <ShippingAddress>
                <AddressText>
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </AddressText>
              </ShippingAddress>
            )}
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <CreditCard size={20} />
                Payment Information
              </CardTitle>
              <ActionButton onClick={() => toggleSection('payment')}>
                {expandedSections.payment ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </ActionButton>
            </CardHeader>
            {expandedSections.payment && (
              <PaymentInfo>
                <PaymentMethod>
                  <PaymentIcon>
                    <CreditCard size={16} />
                  </PaymentIcon>
                  <PaymentDetails>
                    <PaymentLabel>Payment Method</PaymentLabel>
                    <PaymentValue>{order.paymentMethod}</PaymentValue>
                  </PaymentDetails>
                </PaymentMethod>
                
                <PaymentMethod>
                  <PaymentIcon>
                    <DollarSign size={16} />
                  </PaymentIcon>
                  <PaymentDetails>
                    <PaymentLabel>Payment Status</PaymentLabel>
                    <PaymentValue style={{ 
                      color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                      textTransform: 'capitalize'
                    }}>
                      {order.paymentStatus}
                    </PaymentValue>
                  </PaymentDetails>
                </PaymentMethod>
              </PaymentInfo>
            )}
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                <DollarSign size={20} />
                Order Summary
              </CardTitle>
            </CardHeader>
            <OrderSummary>
              <SummaryRow>
                <SummaryLabel>Subtotal ({totalItems} items)</SummaryLabel>
                <SummaryValue>${order.totalPrice.toLocaleString()}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Shipping</SummaryLabel>
                <SummaryValue>Free</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Tax</SummaryLabel>
                <SummaryValue>Included</SummaryValue>
              </SummaryRow>
              <SummaryRow className="total">
                <SummaryLabel>Total</SummaryLabel>
                <SummaryValue>${order.totalPrice.toLocaleString()}</SummaryValue>
              </SummaryRow>
            </OrderSummary>
          </Card>
        </RightColumn>
      </MainContent>
    </OrderDetailsContainer>
  );
};

export default OrderDetails; 