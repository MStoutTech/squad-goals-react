import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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
          className="text-[16px] md:text-sm border border-purple-300 rounded-md px-3 py-2 mb-6 h-[44px] w-full"
          onChange={onChange ? onChange : ""}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={inputId}
          name={inputName}
          className="text-[16px] md:text-sm border border-purple-300 rounded-md px-3 py-2 mb-6 h-[44px]"
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
          className={`${className} text-[16px] md:text-sm border border-purple-300 rounded-md px-3 py-2 mb-6`}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <textarea
          name={inputName}
          id={inputId}
          className={`${className} text-[16px] md:text-sm border border-purple-300 rounded-md px-3 py-2 mb-6`}
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
          className="text-[16px] md:text-sm border border-purple-300 rounded-md px-3 py-2 mb-6 min-h-[44px]"
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          type="date"
          name={inputName}
          className="text-[16px] md:text-sm border border-purple-300 rounded-md px-3 py-2 mb-6 min-h-[44px]"
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

export function MultipleSelectChip({ tags, selectedTags, updateTags }) {
  const theme = useTheme();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    slotProps: {
      paper: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
          backgroundColor: `var(--c-violet-void)`,
          color: "white",
        },
      },
    },
  };

  function getStyles(tag, selectedTags, theme) {
    return {
      fontWeight: selectedTags.includes(tag)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
      fontFamily: "Armata",
      fontSize: ".8rem",
    };
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    updateTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 0, mb: 2, width: "100%" }}>
        <InputLabel
          id="contact-tags-input"
          className="text-md text-white font-[Armata]"
        >
          Tags
        </InputLabel>
        <Select
          labelId="contact-tags-input"
          id="tags-input"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--c-purple-tech-40)",
              borderRadius: "5px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--c-purple-tech-60)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3574e9",
            },
            "& .MuiSelect-icon": { color: "var(--c-purple-tech-40)" },
          }}
          multiple
          value={selectedTags}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  className="text-xs font-bold font-[Armata] text-(--c-violet-void-80) bg-(--c-purple-tech-80)"
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {tags.map((tag) => (
            <MenuItem
              key={tag}
              value={tag}
              sx={{
                fontFamily: "Armata",
                "&:hover": { backgroundColor: "var(--c-violet-void-60)" },
                "&.Mui-selected": {
                  backgroundColor: "var(--c-purple-tech-80)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "var(--c-purple-tech-60)",
                },
              }}
              style={getStyles(tag, selectedTags, theme)}
            >
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
