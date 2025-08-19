// Common toast messages for CRUD operations and other actions

export const toastMessages = {
  // Product operations
  product: {
    create: {
      success: {
        title: "Product Created",
        message: "Product has been created successfully!",
      },
      error: {
        title: "Creation Failed",
        message: "Failed to create product. Please try again.",
      },
    },
    update: {
      success: {
        title: "Product Updated",
        message: "Product has been updated successfully!",
      },
      error: {
        title: "Update Failed",
        message: "Failed to update product. Please try again.",
      },
    },
    delete: {
      success: {
        title: "Product Deleted",
        message: "Product has been deleted successfully!",
      },
      error: {
        title: "Deletion Failed",
        message: "Failed to delete product. Please try again.",
      },
    },
  },

  // Order operations
  order: {
    create: {
      success: {
        title: "Order Created",
        message: "Order has been created successfully!",
      },
      error: {
        title: "Creation Failed",
        message: "Failed to create order. Please try again.",
      },
    },
    update: {
      success: {
        title: "Order Updated",
        message: "Order status has been updated successfully!",
      },
      error: {
        title: "Update Failed",
        message: "Failed to update order. Please try again.",
      },
    },
    delete: {
      success: {
        title: "Order Cancelled",
        message: "Order has been cancelled successfully!",
      },
      error: {
        title: "Cancellation Failed",
        message: "Failed to cancel order. Please try again.",
      },
    },
  },

  // Customer operations
  customer: {
    create: {
      success: {
        title: "Customer Added",
        message: "Customer has been added successfully!",
      },
      error: {
        title: "Addition Failed",
        message: "Failed to add customer. Please try again.",
      },
    },
    update: {
      success: {
        title: "Customer Updated",
        message: "Customer information has been updated successfully!",
      },
      error: {
        title: "Update Failed",
        message: "Failed to update customer. Please try again.",
      },
    },
    delete: {
      success: {
        title: "Customer Removed",
        message: "Customer has been removed successfully!",
      },
      error: {
        title: "Removal Failed",
        message: "Failed to remove customer. Please try again.",
      },
    },
  },

  // Authentication operations
  auth: {
    login: {
      success: {
        title: "Welcome Back!",
        message: "You have been logged in successfully.",
      },
      error: {
        title: "Login Failed",
        message: "Invalid credentials. Please try again.",
      },
    },
    logout: {
      success: {
        title: "Logged Out",
        message: "You have been logged out successfully.",
      },
    },
    register: {
      success: {
        title: "Account Created",
        message: "Your account has been created successfully!",
      },
      error: {
        title: "Registration Failed",
        message: "Failed to create account. Please try again.",
      },
    },
  },

  // File operations
  file: {
    upload: {
      success: {
        title: "File Uploaded",
        message: "File has been uploaded successfully!",
      },
      error: {
        title: "Upload Failed",
        message: "Failed to upload file. Please try again.",
      },
    },
    delete: {
      success: {
        title: "File Deleted",
        message: "File has been deleted successfully!",
      },
      error: {
        title: "Deletion Failed",
        message: "Failed to delete file. Please try again.",
      },
    },
  },

  // Settings operations
  settings: {
    save: {
      success: {
        title: "Settings Saved",
        message: "Your settings have been saved successfully!",
      },
      error: {
        title: "Save Failed",
        message: "Failed to save settings. Please try again.",
      },
    },
    reset: {
      success: {
        title: "Settings Reset",
        message: "Settings have been reset to default values.",
      },
      error: {
        title: "Reset Failed",
        message: "Failed to reset settings. Please try again.",
      },
    },
  },

  // General operations
  general: {
    save: {
      success: {
        title: "Saved Successfully",
        message: "Changes have been saved successfully!",
      },
      error: {
        title: "Save Failed",
        message: "Failed to save changes. Please try again.",
      },
    },
    delete: {
      success: {
        title: "Deleted Successfully",
        message: "Item has been deleted successfully!",
      },
      error: {
        title: "Deletion Failed",
        message: "Failed to delete item. Please try again.",
      },
    },
    copy: {
      success: {
        title: "Copied to Clipboard",
        message: "Text has been copied to clipboard.",
      },
      error: {
        title: "Copy Failed",
        message: "Failed to copy text. Please try again.",
      },
    },
    export: {
      success: {
        title: "Export Successful",
        message: "Data has been exported successfully!",
      },
      error: {
        title: "Export Failed",
        message: "Failed to export data. Please try again.",
      },
    },
    import: {
      success: {
        title: "Import Successful",
        message: "Data has been imported successfully!",
      },
      error: {
        title: "Import Failed",
        message: "Failed to import data. Please try again.",
      },
    },
  },

  // Network operations
  network: {
    online: {
      title: "Connection Restored",
      message: "You are back online.",
    },
    offline: {
      title: "No Internet Connection",
      message: "Please check your internet connection.",
    },
    timeout: {
      title: "Request Timeout",
      message: "The request took too long. Please try again.",
    },
  },

  // Validation messages
  validation: {
    required: {
      title: "Required Field",
      message: "Please fill in all required fields.",
    },
    invalid: {
      title: "Invalid Input",
      message: "Please check your input and try again.",
    },
    fileSize: {
      title: "File Too Large",
      message: "File size exceeds the maximum limit.",
    },
    fileType: {
      title: "Invalid File Type",
      message: "Please select a valid file type.",
    },
  },
};

// Helper function to get toast message
export const getToastMessage = (category, operation, type = "success") => {
  try {
    return (
      toastMessages[category]?.[operation]?.[type] || {
        title: "Operation Completed",
        message: "The operation has been completed successfully.",
      }
    );
  } catch (error) {
    return {
      title: "Operation Completed",
      message: "The operation has been completed successfully.",
    };
  }
};

// Helper function to get error message with custom error
export const getErrorMessage = (category, operation, customError = null) => {
  const defaultError = getToastMessage(category, operation, "error");

  if (customError) {
    return {
      title: defaultError.title,
      message: customError,
    };
  }

  return defaultError;
};
