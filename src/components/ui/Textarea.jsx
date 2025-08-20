import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px 14px; /* Reduced from 12px 16px */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px; /* Reduced from 8px */
  font-size: 13px; /* Reduced from 14px */
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px; /* Reduced from 100px */
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20; /* Reduced from 3px */
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Textarea = ({ ...props }) => {
  return <StyledTextarea {...props} />;
};

export default Textarea; 