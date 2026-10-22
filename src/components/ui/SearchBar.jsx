import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search…',
  className = '',
}) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const fireChange = useCallback(
    (val) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange?.(val);
      }, 300);
    },
    [onChange]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    fireChange(val);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="
          w-full h-[42px] pl-10 pr-10 rounded text-sm font-body text-text
          border-[1.5px] border-border-hover bg-surface
          placeholder:text-text-light
          transition-colors duration-150
          focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20
        "
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            p-1 min-w-[44px] min-h-[44px] flex items-center justify-center
            text-text-light hover:text-text rounded
            cursor-pointer transition-colors duration-150
            focus:outline-none focus:ring-3 focus:ring-primary/20
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
