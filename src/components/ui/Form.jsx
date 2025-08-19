import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Error = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Form = ({ children, onSubmit, ...props }) => {
  return (
    <StyledForm onSubmit={onSubmit} {...props}>
      {children}
    </StyledForm>
  );
};

const FormRowComponent = ({ label, error, children }) => {
  return (
    <FormRow>
      {label && <Label>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </FormRow>
  );
};

export { FormRowComponent as FormRow };
export default Form; 