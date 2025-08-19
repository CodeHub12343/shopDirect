import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 8px;
  }
  
  ${props => {
    switch (props.variation) {
      case 'secondary':
        return `
          background-color: ${props.theme.colors.backgroundCard};
          color: ${props.theme.colors.textPrimary};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.backgroundSecondary};
            border-color: ${props.theme.colors.primary};
          }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.error};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.errorDark || '#dc2626'};
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px ${props.theme.colors.primary}30;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const Button = ({ children, variation = 'primary', ...props }) => {
  return (
    <StyledButton variation={variation} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button; 