import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../services/apiProduct";
import { getProductAnalytics } from "../../services/apiAnalytics";

export const useProductDetails = (productId) => {
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Product query error:", error);
    },
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["productAnalytics"],
    queryFn: getProductAnalytics,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Product analytics query error:", error);
    },
    placeholderData: [],
  });

  // Calculate product-specific analytics
  const productAnalytics = React.useMemo(() => {
    if (!product || !analyticsData) return null;

    const productAnalytics = analyticsData.find(
      (item) => item.name === product.name
    );

    if (productAnalytics) {
      return {
        totalViews: productAnalytics.views || 0,
        totalSales: productAnalytics.sales || 0,
        revenue: productAnalytics.revenue || 0,
        conversionRate:
          productAnalytics.views > 0
            ? ((productAnalytics.sales / productAnalytics.views) * 100).toFixed(
                1
              )
            : 0,
        avgOrderValue:
          productAnalytics.sales > 0
            ? (productAnalytics.revenue / productAnalytics.sales).toFixed(0)
            : 0,
        stockLevel: product.stockQuantity || 0,
        reorderPoint: Math.ceil((product.stockQuantity || 0) * 0.2), // 20% of current stock
        daysInStock:
          product.stockQuantity > 0
            ? Math.ceil(productAnalytics.sales / 30) // Assuming monthly sales rate
            : 0,
      };
    }

    // Fallback analytics if product not found in analytics data
    return {
      totalViews: product.ratingsQuantity || 0,
      totalSales: 0,
      revenue: 0,
      conversionRate: 0,
      avgOrderValue: 0,
      stockLevel: product.stockQuantity || 0,
      reorderPoint: Math.ceil((product.stockQuantity || 0) * 0.2),
      daysInStock: 0,
    };
  }, [product, analyticsData]);

  return {
    product,
    productAnalytics,
    isLoading: productLoading || analyticsLoading,
    error: productError || analyticsError,
  };
};
