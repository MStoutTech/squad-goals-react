export function ModalTextInput({
  labelText,
  inputId,
  inputName,
  value,
  onChange,
  required = false,
}) {
  return (
    <div key="inputId" className="flex flex-col">
      <label htmlFor={inputId} className="text-xs text-white">
        {labelText}
      </label>
      {onChange ? (
        <input
          type="text"
          id={inputId}
          name={inputName}
          value={value}
          className="border border-purple-300 rounded-md px-3 py-2 mb-6 h-[44px]"
          onChange={onChange ? onChange : ""}
          required={required}
        />
      ) : (
        <input
          type="text"
          id={inputId}
          name={inputName}
          className="border border-purple-300 rounded-md px-3 py-2 mb-6 h-[44px]"
          required={required}
        />
      )}
    </div>
  );
}
export function ModalSelectInput({
  labelText,
  inputId,
  inputName,
  required,
  children,
}) {
  return (
    <div key="inputId" className="flex flex-col">
      <label htmlFor={inputId} className="text-xs text-white">
        {labelText}
      </label>
      <select
        name={inputName}
        id={inputId}
        className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6 h-[44px]"
        required={required}
      >
        {children}
      </select>
    </div>
  );
}
