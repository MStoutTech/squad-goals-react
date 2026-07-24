export function ModalTextInput({
  labelText,
  type = "text",
  inputId,
  inputName,
  value,
  onChange,
  required = false,
  divClassName,
}) {
  return (
    <div key={inputId} className={`${divClassName} flex flex-col`}>
      <label htmlFor={inputId} className="text-xs text-white w-full">
        {labelText}
      </label>
      {onChange ? (
        <input
          type={type}
          pattern={type == "email" ? ".+@example\.com" : ""}
          id={inputId}
          name={inputName}
          value={value}
          className="border border-purple-300 rounded-md px-3 py-2 mb-6 h-[44px] w-full"
          onChange={onChange ? onChange : ""}
          required={required}
        />
      ) : (
        <input
          type={type}
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
  value,
  onChange,
  required,
  children,
}) {
  return (
    <div key="inputId" className="flex flex-col">
      {labelText && (
        <label htmlFor={inputId} className="text-xs text-white">
          {labelText}
        </label>
      )}
      {onChange ? (
        <select
          name={inputName}
          id={inputId}
          value={value}
          onChange={onChange}
          className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6 h-[44px]"
          required={required}
        >
          {children}
        </select>
      ) : (
        <select
          name={inputName}
          id={inputId}
          className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6 h-[44px]"
          required={required}
        >
          {children}
        </select>
      )}
    </div>
  );
}

export function ModalFieldset({ label, children }) {
  return (
    <fieldset className="flex flex-wrap max-w-[400px] mb-6">
      <legend className="text-xs text-white">{label}</legend>
      {children}
    </fieldset>
  );
}

export function ModalCheckbox({ label, id, name, value, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex gap-4 items-center h-[44px] min-w-[44px] pl-4"
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

export function ModalTextarea({
  labelText,
  inputId,
  inputName,
  value,
  onChange,
  className,
  required = false,
  placeholder,
}) {
  return (
    <>
      <label htmlFor={inputId} className="text-xs text-white">
        {labelText}
      </label>
      {onChange ? (
        <textarea
          name={inputName}
          id={inputId}
          className={`${className} border border-purple-300 rounded-md px-3 py-2 mb-6`}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <textarea
          name={inputName}
          id={inputId}
          className={`${className} border border-purple-300 rounded-md px-3 py-2 mb-6`}
          required={required}
          placeholder={placeholder}
        ></textarea>
      )}
    </>
  );
}

export function ModalDateInput({
  labelText,
  inputName,
  value,
  onChange,
  required = false,
}) {
  return (
    <>
      <label htmlFor={inputName} className="text-xs text-white mt-6">
        {labelText}
      </label>
      {onChange ? (
        <input
          type="date"
          name={inputName}
          className="border border-purple-300 rounded-md px-3 py-2 mb-6 min-h-[44px]"
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          type="date"
          name={inputName}
          className="border border-purple-300 rounded-md px-3 py-2 mb-6 min-h-[44px]"
          required={required}
        />
      )}
    </>
  );
}

export function ModalRadio({ labelText, inputName, value, required = false }) {
  return (
    <label className="min-h-[44px] min-w-[44px] flex gap-2 items-center">
      <input type="radio" name={inputName} value={value} required={required} />
      {labelText}
    </label>
  );
}
