import { useState } from 'react';

export default function useStateStorage(key, initialValue)  {
  const [storedValue, setStoredValue] = useState(initialValue);
  return [storedValue, setStoredValue];
};