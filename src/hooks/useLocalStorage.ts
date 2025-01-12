export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {}
  };

  const removeItem = () => {
    try {
      const item = window.localStorage.removeItem(key);
    } catch (error) {}
  };

  return { setItem, getItem, removeItem };
};
