import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Form, { FormRow } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useLogin } from '../features/auth/useLogin';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowLg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 64px;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }
  
  @media (max-width: 768px) {
    padding: 48px 32px;
    max-width: 400px;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Logo = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 28px;
  font-weight: bold;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 24px;
    border-radius: 16px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 12px 0;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 32px;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  z-index: 1;
`;

const StyledInput = styled(Input)`
  padding-left: 48px;
  font-size: 16px;
  padding: 16px 16px 16px 48px;
  border-radius: 12px;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.border};
  }
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}20;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
  
  @media (max-width: 768px) {
    margin-top: 32px;
    padding-top: 24px;
    font-size: 14px;
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

function LoginForm() {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginUser, isLoading } = useLogin();

  function onSubmit(data) {
    console.log('Login data:', data);
    loginUser(data);
  }

  return (
    <LoginContainer>
      <LoginCard>
                 <BackLink to="/signup">
           <ArrowLeft size={16} />
           Back to Signup
         </BackLink>
        
        <Header>
          <Logo>SD</Logo>
          <Title>Welcome back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow label="Email address" error={errors?.email?.message}>
            <InputWrapper>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <StyledInput
                type="email"
                id="email"
                placeholder="Enter your email address"
                disabled={isLoading}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </InputWrapper>
          </FormRow>

          <FormRow label="Password" error={errors?.password?.message}>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <StyledInput
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
            <ForgotPasswordLink to="/forgot-password">
              Forgot your password?
            </ForgotPasswordLink>
          </FormRow>

          <FormRow>
            <Button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '18px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {isLoading ? (
                <>
                  <Spinner size="16px" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </FormRow>
        </Form>

        <SignupLink>
          Don't have an account?{" "}
          <StyledLink to="/signup">Sign up</StyledLink>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
}

export default LoginForm; 