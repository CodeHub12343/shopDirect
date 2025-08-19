import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SpinnerElement = styled.div`
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = ({ size, ...props }) => {
  return (
    <SpinnerContainer {...props}>
      <SpinnerElement size={size} />
    </SpinnerContainer>
  );
};

export default Spinner; 