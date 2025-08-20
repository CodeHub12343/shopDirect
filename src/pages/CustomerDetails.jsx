import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  TrendingUp,
  User,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { useCustomer } from '../features/customers/useCustomer';

const CustomerDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CustomerHeader = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 24px;
`;

const CustomerAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 48px;
  position: relative;
`;

const CustomerInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const CustomerEmail = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;

const CustomerMeta = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CustomerActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
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
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
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
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor};
  color: white;
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const OrderMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const OrderAmount = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return '#dcfce7';
      case 'shipped': return '#dbeafe';
      case 'processing': return '#fef3c7';
      case 'pending': return '#fef3c7';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
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
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.error};
  padding: 40px;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customer, isLoading, error, refetch } = useCustomer(customerId);

  // Helper functions
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getImageUrl = (imagePath, type = 'users') => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/img/${type}/${imagePath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const calculateTotalSpent = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) return 0;
    return orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  const getOrderStatus = (order) => {
    if (order.isDelivered) return 'delivered';
    if (order.paymentStatus === 'paid') return 'shipped';
    if (order.paymentStatus === 'pending') return 'pending';
    return 'processing';
  };

  // Loading state
  if (isLoading) {
    return (
      <CustomerDetailsContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/customers')}>
            <ArrowLeft size={16} />
            Back to Customers
          </BackButton>
        </PageHeader>
        <LoadingContainer>
          <Spinner size="40px" />
          <h2>Loading customer details...</h2>
        </LoadingContainer>
      </CustomerDetailsContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <CustomerDetailsContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/customers')}>
            <ArrowLeft size={16} />
            Back to Customers
          </BackButton>
        </PageHeader>
        <ErrorContainer>
          <h2>Error loading customer</h2>
          <p>{error.message}</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Please check if your backend server is running on http://127.0.0.1:5000
          </p>
          <RetryButton onClick={refetch}>
            <RefreshCw size={16} />
            Try Again
          </RetryButton>
        </ErrorContainer>
      </CustomerDetailsContainer>
    );
  }

  // Customer not found
  if (!customer) {
    return (
      <CustomerDetailsContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/customers')}>
            <ArrowLeft size={16} />
            Back to Customers
          </BackButton>
        </PageHeader>
        <ErrorContainer>
          <h2>Customer not found</h2>
          <p>The customer you're looking for doesn't exist or has been removed.</p>
          <RetryButton onClick={() => navigate('/customers')}>
            <ArrowLeft size={16} />
            Back to Customers
          </RetryButton>
        </ErrorContainer>
      </CustomerDetailsContainer>
    );
  }

  const safeCustomer = customer || {};
  const orders = safeCustomer.orders || [];
  const totalSpent = calculateTotalSpent(orders);
  const recentOrders = orders.slice(0, 5);

  return (
    <CustomerDetailsContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/customers')}>
          <ArrowLeft size={16} />
          Back to Customers
        </BackButton>
        <PageTitle>Customer Details</PageTitle>
      </PageHeader>

      <CustomerHeader>
        <CustomerAvatar>
          {safeCustomer.photo ? (
            <img 
              src={getImageUrl(safeCustomer.photo)} 
              alt={safeCustomer.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{ 
            display: safeCustomer.photo ? 'none' : 'flex',
            width: '100%', 
            height: '100%', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '50%',
            color: 'white',
            fontWeight: '600',
            fontSize: '48px'
          }}>
            {getInitials(safeCustomer.name)}
          </div>
        </CustomerAvatar>
        
        <CustomerInfo>
          <CustomerName>{safeCustomer.name}</CustomerName>
          <CustomerEmail>{safeCustomer.email}</CustomerEmail>
          <CustomerMeta>
            <MetaItem>
              <Calendar size={16} />
              Joined {formatDate(safeCustomer.createdAt)}
            </MetaItem>
            <MetaItem>
              <ShoppingBag size={16} />
              {orders.length} orders
            </MetaItem>
            <MetaItem>
              <DollarSign size={16} />
              ${totalSpent.toLocaleString()} total spent
            </MetaItem>
            <MetaItem>
              <Star size={16} />
              Role: {safeCustomer.role}
            </MetaItem>
          </CustomerMeta>
        </CustomerInfo>
        
        <CustomerActions>
          <ActionButton>
            <Edit size={16} />
            Edit
          </ActionButton>
          <ActionButton>
            <Mail size={16} />
            Email
          </ActionButton>
        </CustomerActions>
      </CustomerHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <ShoppingBag size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{orders.length}</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>${totalSpent.toLocaleString()}</StatValue>
            <StatLabel>Total Spent</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>${orders.length > 0 ? (totalSpent / orders.length).toFixed(0) : 0}</StatValue>
            <StatLabel>Average Order</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
            <Star size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{safeCustomer.role}</StatValue>
            <StatLabel>Customer Role</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <SectionTitle>
            <Package size={20} />
            Recent Orders
          </SectionTitle>
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <OrderItem key={order._id || index}>
                <OrderIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                  <ShoppingBag size={20} />
                </OrderIcon>
                <OrderInfo>
                  <OrderTitle>Order #{order._id?.slice(-8) || 'N/A'}</OrderTitle>
                  <OrderMeta>
                    {formatDate(order.createdAt)} • {getOrderStatus(order)}
                  </OrderMeta>
                </OrderInfo>
                <OrderAmount>${order.totalPrice?.toLocaleString() || 0}</OrderAmount>
                <StatusBadge status={getOrderStatus(order)}>
                  {getOrderStatus(order)}
                </StatusBadge>
              </OrderItem>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-textSecondary)' }}>
              <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No orders yet</p>
            </div>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <User size={20} />
            Customer Information
          </SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={16} style={{ color: 'var(--color-textSecondary)' }} />
              <span style={{ color: 'var(--color-textPrimary)' }}>{safeCustomer.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={16} style={{ color: 'var(--color-textSecondary)' }} />
              <span style={{ color: 'var(--color-textPrimary)' }}>
                Member since {formatDate(safeCustomer.createdAt)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingBag size={16} style={{ color: 'var(--color-textSecondary)' }} />
              <span style={{ color: 'var(--color-textPrimary)' }}>
                {orders.length} orders placed
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DollarSign size={16} style={{ color: 'var(--color-textSecondary)' }} />
              <span style={{ color: 'var(--color-textPrimary)' }}>
                ${totalSpent.toLocaleString()} total spent
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Star size={16} style={{ color: 'var(--color-textSecondary)' }} />
              <span style={{ color: 'var(--color-textPrimary)' }}>
                Role: {safeCustomer.role}
              </span>
            </div>
          </div>
        </Section>
      </ContentGrid>
    </CustomerDetailsContainer>
  );
};

export default CustomerDetails; 