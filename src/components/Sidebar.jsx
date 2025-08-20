import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

const SidebarBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: calc(var(--z-fixed) - 1);
  
  @media (min-width: 1025px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside`
  width: 224px; /* Reduced from 280px for 80% zoom (280 * 0.8 = 224) */
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--z-fixed);
  overflow-y: auto;
  transition: var(--transition-normal);
  font-family: var(--font-primary);
  
  @media (max-width: 1024px) {
    transform: translateX(-100%);
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const SidebarHeader = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-textSecondary);
  cursor: pointer;
  transition: var(--transition-normal);
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background: var(--color-gray-100);
    color: var(--color-text);
  }
`;

const Logo = styled.div`
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  text-align: center;
  line-height: var(--leading-tight);
`;

const LogoSubtitle = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  color: var(--color-textSecondary);
  text-align: center;
  margin-top: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Nav = styled.nav`
  padding: var(--spacing-lg) 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-textSecondary);
  text-decoration: none;
  transition: var(--transition-normal);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  
  &:hover {
    background: var(--color-gray-100);
    color: var(--color-text);
  }
  
  &.active {
    background: var(--color-primary);
    color: white;
    
    svg {
      color: white;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: inherit;
    transition: var(--transition-normal);
  }
`;

const SidebarFooter = styled.div`
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
  margin-top: auto;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-error);
  cursor: pointer;
  transition: var(--transition-normal);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  
  &:hover {
    background: var(--color-error);
    color: white;
    border-color: var(--color-error);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-md);
`;

const UserName = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
`;

const UserRole = styled.div`
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  color: var(--color-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatsSection = styled.div`
  margin-top: 32px;
  padding: 24px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin: 32px 16px 0;
`;

const StatsTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: #cbd5e1;
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <>
      {isSidebarOpen && <SidebarBackdrop onClick={closeSidebar} />}
      <SidebarContainer className={isSidebarOpen ? 'open' : ''}>
              <SidebarHeader>
        <Logo>
          ShopAdmin
          <LogoSubtitle>Admin Dashboard</LogoSubtitle>
        </Logo>
        <CloseButton onClick={closeSidebar}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>
      
      <Nav>
        <NavList>
          {menuItems.map((item) => (
            <NavItem key={item.path}>
              <NavLinkStyled to={item.path}>
                <item.icon />
                {item.label}
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </Nav>
      
      <SidebarFooter>
        <UserInfo>
          <UserName>{user?.name}</UserName>
          <UserRole>{user?.role}</UserRole>
        </UserInfo>
        <LogoutButton>
          <LogOut />
          Log Out
        </LogoutButton>
      </SidebarFooter>
      
      <StatsSection>
        <StatsTitle>Quick Stats</StatsTitle>
        <StatItem>
          <StatLabel>Today's Sales</StatLabel>
          <StatValue>$12,450</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>New Orders</StatLabel>
          <StatValue>24</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Active Users</StatLabel>
          <StatValue>1,234</StatValue>
        </StatItem>
      </StatsSection>
    </SidebarContainer>
    </>
  );
};

export default Sidebar; 