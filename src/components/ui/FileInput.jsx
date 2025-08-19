/* import styled from 'styled-components';

const FileInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
    color: #3b82f6;
  }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f3f4f6;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
`;

const FileName = styled.span`
  font-weight: 500;
`;

const FileSize = styled.span`
  color: #6b7280;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;
  
  &:hover {
    background-color: #fef2f2;
  }
`;

const FileInput = ({ 
  id, 
  accept = "image/*", 
  onChange, 
  disabled = false,
  value,
  onRemove,
  ...props 
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onChange) {
      onChange(e);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <FileInputContainer>
      <FileInputWrapper>
        <HiddenInput
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          {...props}
        />
        <FileInputButton>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Choose file
        </FileInputButton>
      </FileInputWrapper>
      
      {value && (
        <FilePreview>
          <FileName>{value.name}</FileName>
          <FileSize>({formatFileSize(value.size)})</FileSize>
          {onRemove && (
            <RemoveButton onClick={onRemove} type="button">
              ✕
            </RemoveButton>
          )}
        </FilePreview>
      )}
    </FileInputContainer>
  );
};

export default FileInput;  */


import styled from 'styled-components';

const FileInputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilePreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FileName = styled.span`
  font-weight: 500;
`;

const FileSize = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error}20;
  }
`;

const FileInput = ({
  id,
  accept = "image/*",
  onChange,
  disabled = false,
  value,
  multiple = false,
  onRemove,
  ...props
}) => {
  const safeValue = Array.isArray(value) ? value : []; // ✅ Null-safe fallback

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (onChange) onChange(files); // Always pass as an array
  };

  const handleRemove = (index) => {
    if (onChange) {
      const updatedFiles = safeValue.filter((_, i) => i !== index);
      onChange(updatedFiles); // Auto-updates form value
    }
    if (onRemove) onRemove(index);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <FileInputContainer>
      <FileInputWrapper>
        <HiddenInput
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          multiple={multiple}
          {...props}
        />
        <FileInputButton>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {multiple ? "Choose files" : "Choose file"}
        </FileInputButton>
      </FileInputWrapper>

      {safeValue.length > 0 && (
        <FilePreviewList>
          {safeValue.map((file, index) => (
            <FilePreview key={index}>
              <FileName>{file.name}</FileName>
              <FileSize>({formatFileSize(file.size)})</FileSize>
              <RemoveButton type="button" onClick={() => handleRemove(index)}>
                ✕
              </RemoveButton>
            </FilePreview>
          ))}
        </FilePreviewList>
      )}
    </FileInputContainer>
  );
};

export default FileInput;
