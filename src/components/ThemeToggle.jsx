import React, { useState } from 'react';
import styled from 'styled-components';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggleContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.colors.shadow};

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-color: ${({ theme }) => theme.colors.borderDark};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.colors.shadowMd};
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
  z-index: 1000;
  min-width: 160px;
  overflow: hidden;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.textPrimary};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  .active-indicator {
    margin-left: auto;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme, active }) => 
      active ? theme.colors.primary : 'transparent'};
  }
`;

const ThemeToggle = () => {
  const { themeMode, setTheme, isDark, isLight, isAuto } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (mode) => {
    setTheme(mode);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    if (isAuto) return <Monitor />;
    if (isDark) return <Moon />;
    return <Sun />;
  };

  const getThemeLabel = () => {
    if (isAuto) return 'Auto';
    if (isDark) return 'Dark';
    return 'Light';
  };

  const themeOptions = [
    { mode: 'light', label: 'Light', icon: <Sun />, active: isLight },
    { mode: 'dark', label: 'Dark', icon: <Moon />, active: isDark },
    { mode: 'auto', label: 'Auto', icon: <Monitor />, active: isAuto },
  ];

  return (
    <ThemeToggleContainer>
      <ToggleButton onClick={handleToggle}>
        {getThemeIcon()}
        <span>{getThemeLabel()}</span>
        <ChevronDown size={14} style={{ opacity: 0.6 }} />
      </ToggleButton>
      
      <Dropdown isOpen={isOpen}>
        {themeOptions.map((option) => (
          <DropdownItem
            key={option.mode}
            onClick={() => handleThemeChange(option.mode)}
            active={option.active}
          >
            {option.icon}
            <span>{option.label}</span>
            <div className="active-indicator" />
          </DropdownItem>
        ))}
      </Dropdown>
    </ThemeToggleContainer>
  );
};

export default ThemeToggle; 