import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertCircle,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { useGetOrder } from '../features/orders/useGetOrder';
import { useAuth } from '../contexts/AuthContext';

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StatsGrid = styled.div`
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
  color: ${({ theme }) => theme.colors.textTertiary};
  width: 18px;
  height: 18px;
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

const FilterButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 12px 16px;
  border-radius: 8px;
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
`;

const OrdersTable = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CustomerName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
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
      case 'processing': return '#dbeafe';
      case 'pending': return '#fef3c7';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return '#166534';
      case 'shipped': return '#1e40af';
      case 'processing': return '#1e40af';
      case 'pending': return '#92400e';
      case 'cancelled': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const Price = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DateText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
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

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Helper function to get order status based on payment and delivery status
const getOrderStatus = (order) => {
  if (order.isDelivered) return 'delivered'; 
  if (order.paymentStatus === 'paid') return 'processing';
  if (order.paymentStatus === 'pending') return 'cancelled';
  return 'processing';
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to get unique statuses from live orders
const getUniqueStatuses = (orders) => {
  if (!orders || orders.length === 0) return ['all'];
  const statuses = orders.map(order => getOrderStatus(order));
  return ['all', ...new Set(statuses)];
};

const Orders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { Liveorders, isLoading, error } = useGetOrder();
  const { isAuthenticated, user } = useAuth();
  
  console.log('Live orders:', Liveorders);
  console.log('Auth state:', { isAuthenticated, user });

  // Handle loading state
  if (isLoading) {
    return (
      <OrdersContainer>
        <div>
          <PageTitle>Orders</PageTitle>
          <PageSubtitle>Manage and track all customer orders</PageSubtitle>
        </div>
        <LoadingContainer>
          <Spinner size="40px" />
          <div>Loading orders...</div>
        </LoadingContainer>
      </OrdersContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <OrdersContainer>
        <div>
          <PageTitle>Orders</PageTitle>
          <PageSubtitle>Manage and track all customer orders</PageSubtitle>
        </div>
        <ErrorContainer>
          <div>Error loading orders</div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            {error.message || 'Something went wrong'}
          </div>
        </ErrorContainer>
      </OrdersContainer>
    );
  }

  // Use live orders data
  const orders = Liveorders || [];

  // Calculate stats from live data
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.isDelivered).length;
  const pendingOrders = orders.filter(order => order.paymentStatus === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const orderStatus = getOrderStatus(order);
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'amount':
        return (b.totalPrice || 0) - (a.totalPrice || 0);
      case 'status':
        return getOrderStatus(a).localeCompare(getOrderStatus(b));
      default:
        return 0;
    }
  });

  const statuses = getUniqueStatuses(orders);

  return (
    <OrdersContainer>
      <div>
        <PageTitle>Orders</PageTitle>
        <PageSubtitle>Manage and track all customer orders</PageSubtitle>
      </div>

      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <ShoppingCart size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{totalOrders}</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
            <CheckCircle size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{deliveredOrders}</StatValue>
            <StatLabel>Delivered</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
            <Truck size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{pendingOrders}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>${totalRevenue.toLocaleString()}</StatValue>
            <StatLabel>Revenue</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <FiltersSection>
        <FiltersRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>
          
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </Select>
          
          <FilterButton>
            <Filter size={16} />
            More Filters
          </FilterButton>
        </FiltersRow>
      </FiltersSection>

      {sortedOrders.length === 0 ? (
        <EmptyContainer>
          <ShoppingCart size={48} color="#94a3b8" />
          <div>No orders found</div>
          <div style={{ fontSize: '14px' }}>
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No orders available yet'
            }
          </div>
        </EmptyContainer>
      ) : (
        <OrdersTable>
          <TableHeader>
            <div>Order ID</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Amount</div>
            <div>Items</div>
            <div>Date</div>
            <div>Actions</div>
          </TableHeader>
          
          {sortedOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                <OrderId>#{order._id.slice(-6)}</OrderId>
              </TableCell>
              
              <TableCell>
                <CustomerInfo>
                  <CustomerName>{order.user?.name || 'Unknown Customer'}</CustomerName>
                  <CustomerEmail>{order.user?.email || 'No email'}</CustomerEmail>
                </CustomerInfo>
              </TableCell>
              
              <TableCell>
                <StatusBadge status={getOrderStatus(order)}>
                  {getOrderStatus(order)}
                </StatusBadge>
              </TableCell>
              
              <TableCell>
                <Price>${order.totalPrice?.toLocaleString()}</Price>
              </TableCell>
              
              <TableCell>
                {order.orderItems?.length || 0} items
              </TableCell>
              
              <TableCell>
                <DateText>{formatDate(order.createdAt)}</DateText>
              </TableCell>
              
              <TableCell>
                <Actions>
                                  <ActionButton 
                  title="View Details"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <Eye size={16} />
                </ActionButton>
                  <ActionButton title="Edit Order">
                    <Edit size={16} />
                  </ActionButton>
                </Actions>
              </TableCell>
            </TableRow>
          ))}
        </OrdersTable>
      )}
    </OrdersContainer>
  );
};

export default Orders; 