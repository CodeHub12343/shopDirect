import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px; /* Reduced from 14px 18px */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px; /* Reduced from 10px */
  font-size: 14px; /* Reduced from 15px */
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20; /* Reduced from 4px */
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px; /* Reduced from 12px 16px */
    font-size: 13px; /* Reduced from 14px */
    border-radius: 6px; /* Reduced from 8px */
  }
`;

const Input = ({ ...props }) => {
  return <StyledInput {...props} />;
};

export default Input; 