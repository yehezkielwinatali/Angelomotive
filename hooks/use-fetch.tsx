import React from "react";
import { toast } from "sonner";

const useFetch = (cb: any) => {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fn = async (...args: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cb(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false); // <-- Add this line
  };

  return {
    data,
    isLoading,
    error,
    fn,
    reset,
  };
};

export default useFetch;
