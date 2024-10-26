"use client";
interface InputDisabledProps {
  value: string | number | undefined | null;
  defaultValue?: string;
  placeholder?: string;
}
export const InputDisabled = ({
  value,
  defaultValue,
  placeholder,
}: InputDisabledProps) => {
  return (
    <input
      value={value || defaultValue}
      placeholder={placeholder}
      disabled={true}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
    />
  );
};
