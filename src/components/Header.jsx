import React, { useState } from "react";
import styled from "styled-components";
import { Bell, Search, User, Menu, Settings, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import ThemeToggle from "./ThemeToggle";

const HeaderContainer = styled.header`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(8px);
  font-family: var(--font-primary);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
`;

const Logo = styled.div`
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--color-primary-dark);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) var(--spacing-xl);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  color: var(--color-text);
  width: 300px;
  transition: var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary)20;
  }
  
  &::placeholder {
    color: var(--color-textSecondary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--spacing-sm);
  color: var(--color-textSecondary);
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-textSecondary);
  cursor: pointer;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--color-gray-100);
    color: var(--color-text);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;





const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
`;

const UserName = styled.span`
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--color-error);
  border-radius: 50%;
  border: 2px solid var(--color-surface);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
`;

const MobileMenuButton = styled.button`
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  position: relative;
  
  &:hover {
    background: var(--color-gray-100);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserRole = styled.span`
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  color: var(--color-textSecondary);
`;

const UserAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserAvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: var(--z-dropdown);
  margin-top: var(--spacing-sm);
`;

const UserMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    background: var(--color-gray-100);
  }
`;



const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <HeaderContainer>
      <LeftSection>
        <MobileMenuButton onClick={toggleSidebar}>
          <Menu size={20} />
        </MobileMenuButton>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </LeftSection>
      
      <RightSection>
        <ThemeToggle />
        
        <IconButton>
          <Settings size={18} />
        </IconButton>
        
        <IconButton>
          <Bell size={18} />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>
        
        <UserSection onClick={() => setShowUserMenu(!showUserMenu)}>
          <UserAvatar>
            {user?.photo ? (
              <UserAvatarImage src={`https://shopdirect-api.onrender.com/img/users/${user?.photo}`} alt={user?.name || 'User'} />
            ) : (
              <UserAvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </UserAvatarFallback>
            )}
          </UserAvatar>
          <UserInfo>
            <UserName>{user?.name || 'User'}</UserName>
            <UserRole>{user?.role || 'User'}</UserRole>
          </UserInfo>
          <ChevronDown size={16} color="#64748b" />
        </UserSection>
        
        {showUserMenu && (
          <UserMenu>
            <UserMenuItem onClick={logout}>
              <LogOut size={16} />
              Logout
            </UserMenuItem>
          </UserMenu>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default Header; 