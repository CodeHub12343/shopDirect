import React from "react";
import styled from "styled-components";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Star,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useDashboard } from "../features/dashboard/useDashboard";

// Styled Components with new typography
const DashboardContainer = styled.div`
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  min-height: 100vh;
  font-family: var(--font-primary);
`;

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
  line-height: var(--leading-tight);
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
`;

const StatCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
`;

const StatTitle = styled.h3`
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor || 'var(--color-primary)'};
  color: white;
`;

const StatValue = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const StatChange = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: ${props => props.$isPositive ? 'var(--color-success)' : 'var(--color-error)'};
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const ChartTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  line-height: var(--leading-tight);
`;

const RecentActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const ActivityTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  line-height: var(--leading-tight);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-divider);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor || 'var(--color-primary)'};
  color: white;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActivityTime = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  color: var(--color-textSecondary);
`;

const ActivityValue = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  flex-shrink: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-family: var(--font-primary);
  color: var(--color-textSecondary);
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-family: var(--font-primary);
  color: var(--color-error);
  text-align: center;
  padding: var(--spacing-lg);
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

const Dashboard = React.memo(() => {
  const {
    stats,
    salesData,
    categoryData,
    recentOrders,
    popularProducts,
    isLoading,
    error,
    refetch,
  } = useDashboard();



  // Loading state
  if (isLoading) {
    return (
      <DashboardContainer>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageSubtitle>Welcome back! Here's what's happening with your store today.</PageSubtitle>
        </div>
        <LoadingSpinner>
          <h2>Loading dashboard data...</h2>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardContainer>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageSubtitle>Welcome back! Here's what's happening with your store today.</PageSubtitle>
        </div>
        <ErrorMessage>
          <h2>Error loading dashboard</h2>
          <p>{error.message}</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Please check if your backend server is running on http://127.0.0.1:5000
          </p>
          <RetryButton onClick={refetch}>
            <Calendar size={16} />
            Try Again
          </RetryButton>
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Welcome back! Here's what's happening with your store today.</PageSubtitle>
      </div>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <div>
              <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
              <StatLabel>Total Revenue</StatLabel>
            </div>
            <StatIcon $bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange $isPositive={stats.revenueChange >= 0}>
            {stats.revenueChange >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} />}
            {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <div>
              <StatValue>{stats.totalOrders.toLocaleString()}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </div>
            <StatIcon $bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
              <ShoppingCart size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange $isPositive={stats.ordersChange >= 0}>
            {stats.ordersChange >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} />}
            {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <div>
              <StatValue>{stats.totalCustomers.toLocaleString()}</StatValue>
              <StatLabel>Total Customers</StatLabel>
            </div>
            <StatIcon $bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
              <Users size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange $isPositive={stats.customersChange >= 0}>
            {stats.customersChange >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} />}
            {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <div>
              <StatValue>{stats.totalProducts.toLocaleString()}</StatValue>
              <StatLabel>Total Products</StatLabel>
            </div>
            <StatIcon $bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <Package size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange $isPositive={stats.productsChange >= 0}>
            {stats.productsChange >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} />}
            {stats.productsChange >= 0 ? '+' : ''}{stats.productsChange}% from last month
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Sales & Orders Overview</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="orders" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Sales by Category</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const displayName = typeof name === 'string' ? name : 'Unknown';
                  return `${displayName} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  typeof name === 'string' ? name : 'Unknown',
                  value
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <RecentActivityGrid>
        <ActivityCard>
          <ActivityTitle>Recent Orders</ActivityTitle>
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                  <ShoppingCart size={20} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    {order.customer} • {order.id}
                  </ActivityText>
                  <ActivityTime>
                    {order.time} • {order.status} • {order.totalItems || 0} items
                  </ActivityTime>
                </ActivityContent>
                <ActivityValue>{order.amount}</ActivityValue>
              </ActivityItem>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-textSecondary)' }}>
              <p>No recent orders</p>
            </div>
          )}
        </ActivityCard>

        <ActivityCard>
          <ActivityTitle>Top Performing Products</ActivityTitle>
          {popularProducts.length > 0 ? (
            popularProducts.map((product, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                  <Package size={20} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{product.name}</ActivityText>
                  <ActivityTime>
                    {product.time} • {product.sales ? `${product.sales} sold` : `${product.views} views`}
                  </ActivityTime>
                </ActivityContent>
                <ActivityValue>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    {product.rating.toFixed(1)}
                  </div>
                </ActivityValue>
              </ActivityItem>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-textSecondary)' }}>
              <p>No products available</p>
            </div>
          )}
        </ActivityCard>
      </RecentActivityGrid>
    </DashboardContainer>
  );
});

export default Dashboard; 