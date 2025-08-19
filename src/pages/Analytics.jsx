import React from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Star,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '../features/analytics/useAnalytics';

const AnalyticsContainer = styled.div`
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled.div`
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

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
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

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.isPositive ? props.theme.colors.success : props.theme.colors.error};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 24px 0;
`;

const BottomChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InsightCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InsightTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 16px 0;
`;

const InsightItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InsightLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InsightValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
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

const Analytics = () => {
  const { 
    stats, 
    salesData, 
    categoryData, 
    topProducts, 
    customerSegments, 
    isLoading, 
    error, 
    refetch 
  } = useAnalytics();

  // Loading state
  if (isLoading) {
    return (
      <AnalyticsContainer>
        <div>
          <PageTitle>Analytics</PageTitle>
          <PageSubtitle>Comprehensive insights into your business performance</PageSubtitle>
        </div>
        <LoadingContainer>
          <Spinner size="40px" />
          <h2>Loading analytics data...</h2>
        </LoadingContainer>
      </AnalyticsContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <AnalyticsContainer>
        <div>
          <PageTitle>Analytics</PageTitle>
          <PageSubtitle>Comprehensive insights into your business performance</PageSubtitle>
        </div>
        <ErrorContainer>
          <h2>Error loading analytics</h2>
          <p>{error.message}</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Please check if your backend server is running on http://127.0.0.1:5000
          </p>
          <RetryButton onClick={refetch}>
            <RefreshCw size={16} />
            Try Again
          </RetryButton>
        </ErrorContainer>
      </AnalyticsContainer>
    );
  }
  return (
    <AnalyticsContainer>
      <div>
        <PageTitle>Analytics</PageTitle>
        <PageSubtitle>Comprehensive insights into your business performance</PageSubtitle>
      </div>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <div>
              <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
              <StatLabel>Total Revenue</StatLabel>
            </div>
            <StatIcon bgColor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange isPositive={stats.revenueChange >= 0}>
            {stats.revenueChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <div>
              <StatValue>{stats.totalOrders.toLocaleString()}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </div>
            <StatIcon bgColor="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
              <ShoppingCart size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange isPositive={stats.ordersChange >= 0}>
            {stats.ordersChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <div>
              <StatValue>{stats.totalCustomers.toLocaleString()}</StatValue>
              <StatLabel>Total Customers</StatLabel>
            </div>
            <StatIcon bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
              <Users size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange isPositive={stats.customersChange >= 0}>
            {stats.customersChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <div>
              <StatValue>{stats.totalProducts.toLocaleString()}</StatValue>
              <StatLabel>Total Products</StatLabel>
            </div>
            <StatIcon bgColor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <Package size={24} />
            </StatIcon>
          </StatHeader>
          <StatChange isPositive={stats.productsChange >= 0}>
            {stats.productsChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {stats.productsChange >= 0 ? '+' : ''}{stats.productsChange}% from last month
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Revenue & Orders Trend</ChartTitle>
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

      <BottomChartsGrid>
        <ChartCard>
          <ChartTitle>Top Performing Products</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Customer Growth</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </BottomChartsGrid>

      <InsightsGrid>
        <InsightCard>
          <InsightTitle>Top Products by Revenue</InsightTitle>
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
            <InsightItem key={index}>
              <InsightLabel>{product.name}</InsightLabel>
              <InsightValue>${product.revenue.toLocaleString()}</InsightValue>
            </InsightItem>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              <p>No product data available</p>
            </div>
          )}
        </InsightCard>

        <InsightCard>
          <InsightTitle>Customer Segments</InsightTitle>
          {customerSegments.length > 0 ? (
            customerSegments.map((segment, index) => (
            <InsightItem key={index}>
              <InsightLabel>{segment.segment}</InsightLabel>
              <InsightValue>{segment.count} ({segment.percentage}%)</InsightValue>
            </InsightItem>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              <p>No customer data available</p>
            </div>
          )}
        </InsightCard>
      </InsightsGrid>
    </AnalyticsContainer>
  );
};

export default Analytics; 