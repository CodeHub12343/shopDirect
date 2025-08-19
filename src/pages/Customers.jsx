import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  Users,
  UserPlus,
  TrendingUp
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { useCustomers } from '../features/customers/useCustomers';

const CustomersContainer = styled.div`
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

const CustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const CustomerCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }
`;

const CustomerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const CustomerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
`;

const CustomerInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px 0;
`;

const CustomerEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const CustomerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  text-align: center;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const CustomerStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const CustomerStatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CustomerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CustomerActions = styled.div`
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
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.status === 'active' ? props.theme.colors.success + '20' : props.theme.colors.error + '20'};
  color: ${props => props.status === 'active' ? props.theme.colors.success : props.theme.colors.error};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;



const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Customers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const { customers = [], isLoading, error, refetch } = useCustomers();

  // Helper functions
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getImageUrl = (imagePath, type = 'users') => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:5000/img/${type}/${imagePath}`;
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

  const getLastOrderDate = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) return null;
    try {
      const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sortedOrders[0].createdAt;
    } catch (error) {
      console.error('Error getting last order date:', error);
      return null;
    }
  };

  const getCustomerStatus = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) return 'inactive';
    try {
      const recentOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return orderDate > thirtyDaysAgo;
      });
      return recentOrders.length > 0 ? 'active' : 'inactive';
    } catch (error) {
      console.error('Error getting customer status:', error);
      return 'inactive';
    }
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    
    let filtered = customers.filter(customer => {
      if (!customer || !customer.name || !customer.email) return false;
      
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const customerStatus = getCustomerStatus(customer.orders);
      const matchesStatus = statusFilter === 'all' || customerStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort customers
    filtered.sort((a, b) => {
      try {
        switch (sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'joinDate':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case 'totalSpent':
            return calculateTotalSpent(b.orders) - calculateTotalSpent(a.orders);
          case 'totalOrders':
            return (b.orders?.length || 0) - (a.orders?.length || 0);
          default:
            return 0;
        }
      } catch (error) {
        console.error('Error sorting customers:', error);
        return 0;
      }
    });

    return filtered;
  }, [customers, searchQuery, statusFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!Array.isArray(customers)) {
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        totalRevenue: 0,
        newThisMonth: 0
      };
    }
    
    try {
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(customer => getCustomerStatus(customer.orders) === 'active').length;
      const totalRevenue = customers.reduce((total, customer) => total + calculateTotalSpent(customer.orders), 0);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newThisMonth = customers.filter(customer => {
        try {
          return new Date(customer.createdAt || 0) > thirtyDaysAgo;
        } catch (error) {
          console.error('Error checking customer join date:', error);
          return false;
        }
      }).length;

      return {
        totalCustomers,
        activeCustomers,
        totalRevenue,
        newThisMonth
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        totalRevenue: 0,
        newThisMonth: 0
      };
    }
  }, [customers]);

  // Loading state
  if (isLoading) {
    return (
      <CustomersContainer>
        <div>
          <PageTitle>Customers</PageTitle>
          <PageSubtitle>Manage your customer database and relationships</PageSubtitle>
        </div>
        <LoadingContainer>
          <Spinner size="40px" />
          <p>Loading customers...</p>
        </LoadingContainer>
      </CustomersContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <CustomersContainer>
        <div>
          <PageTitle>Customers</PageTitle>
          <PageSubtitle>Manage your customer database and relationships</PageSubtitle>
        </div>
        <ErrorContainer>
          <h3>Error loading customers</h3>
          <p>{error.message}</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Please check if your backend server is running on http://127.0.0.1:5000
          </p>
          <button onClick={refetch} style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Try Again
          </button>
        </ErrorContainer>
      </CustomersContainer>
    );
  }

  return (
    <CustomersContainer>
      <div>
        <PageTitle>Customers</PageTitle>
        <PageSubtitle>Manage your customer database and relationships</PageSubtitle>
      </div>

      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalCustomers.toLocaleString()}</StatValue>
            <StatLabel>Total Customers</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
            <UserPlus size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.newThisMonth}</StatValue>
            <StatLabel>New This Month</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
            <ShoppingBag size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.activeCustomers.toLocaleString()}</StatValue>
            <StatLabel>Active Customers</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <FiltersSection>
        <FiltersRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="joinDate">Sort by Join Date</option>
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="totalOrders">Sort by Orders</option>
          </Select>
          
          <FilterButton>
            <Filter size={16} />
            More Filters
          </FilterButton>
        </FiltersRow>
      </FiltersSection>

      {filteredCustomers.length === 0 ? (
        <EmptyState>
          <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3>No customers found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </EmptyState>
      ) : (
        <CustomersGrid>
          {filteredCustomers.map((customer) => {
            if (!customer || !customer._id) return null;
            
            const totalSpent = calculateTotalSpent(customer.orders);
            const lastOrderDate = getLastOrderDate(customer.orders);
            const customerStatus = getCustomerStatus(customer.orders);
            
            return (
              <CustomerCard key={customer._id}>
                <CustomerHeader>
                  <CustomerAvatar>
                    {customer.photo ? (
                      <img 
                        src={getImageUrl(customer.photo)} 
                        alt={customer.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ 
                      display: customer.photo ? 'none' : 'flex',
                      width: '100%', 
                      height: '100%', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      borderRadius: '50%',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '20px'
                    }}>
                      {getInitials(customer.name)}
                    </div>
                  </CustomerAvatar>
                  <CustomerInfo>
                    <CustomerName>{customer.name}</CustomerName>
                    <CustomerEmail>{customer.email}</CustomerEmail>
                  </CustomerInfo>
                  <StatusBadge status={customerStatus}>
                    {customerStatus}
                  </StatusBadge>
                </CustomerHeader>
                
                <CustomerStats>
                  <Stat>
                    <CustomerStatValue>{customer.orders?.length || 0}</CustomerStatValue>
                    <CustomerStatLabel>Orders</CustomerStatLabel>
                  </Stat>
                  <Stat>
                    <CustomerStatValue>${totalSpent.toLocaleString()}</CustomerStatValue>
                    <CustomerStatLabel>Total Spent</CustomerStatLabel>
                  </Stat>
                </CustomerStats>
                
                <CustomerDetails>
                  <DetailItem>
                    <Calendar size={14} />
                    Joined {formatDate(customer.createdAt)}
                  </DetailItem>
                  <DetailItem>
                    <ShoppingBag size={14} />
                    {lastOrderDate ? `Last order: ${formatDate(lastOrderDate)}` : 'No orders yet'}
                  </DetailItem>
                  <DetailItem>
                    <MapPin size={14} />
                    {customer.orders?.[0]?.shippingAddress?.city || 'Location not available'}
                  </DetailItem>
                  <DetailItem>
                    <Star size={14} />
                    Role: {customer.role}
                  </DetailItem>
                </CustomerDetails>
                
                                 <CustomerActions>
                   <ActionButton onClick={() => navigate(`${customer._id}`)}>
                     <Eye size={14} />
                     View
                   </ActionButton>
                   <ActionButton>
                     <Edit size={14} />
                     Edit
                   </ActionButton>
                   <ActionButton>
                     <Mail size={14} />
                     Email
                   </ActionButton>
                 </CustomerActions>
              </CustomerCard>
            );
          })}
        </CustomersGrid>
      )}
    </CustomersContainer>
  );
};

export default Customers; 