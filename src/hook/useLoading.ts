'use client'
import { useState } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    showLoading,
    stopLoading,
  };
};

export default useLoading;
