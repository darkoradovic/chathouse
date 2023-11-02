"use client";

import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  const styles = {
    fontSize: 14,
    color: "blue",
  };

  return (
    <div className="z-[100]">
      <label
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
          dark:text-white
        "
      >
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menuList: (provided, state) => ({
              ...provided,
              paddingTop: 0,
              paddingBottom: 0,
            }),
          }}
          classNames={{
            control: () => "text-sm dark:bg-user-list dark:text-white",
            option: () =>
              "text-sm dark:bg-user-list dark:text-white cursor-pointer p-0",
          }}
        />
      </div>
    </div>
  );
};

export default Select;
