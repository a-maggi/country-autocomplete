import GoogleHelper from "./GoogleHelper";
import AsyncSelect from "react-select/async";

export type Option = {
  value: string;
  label: string;
};

export type CountryAutocompleteProps = {
  id?: string;
  value?: Option;
  onSelect: (value: Option) => void;
  onChange?: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  noResultsText?: string;
};

const key = process.env.GOOGLE_API_KEY || "";
if (!key) {
  console.error("GOOGLE_API_KEY environment variable is required");
}

const Google = new GoogleHelper(key);

export const CountryAutocomplete: React.FC<CountryAutocompleteProps> = (props) => {
  const { id, value, onSelect, onChange, onBlur, disabled } = props;
  const { placeholder = "Type to search for a country" } = props;
  const { noResultsText = "No results found" } = props;

  const formatAutocompleteResult = (predictions: google.maps.places.AutocompletePrediction[] | null) => {
    if (!predictions) return [];
    return predictions.map((prediction) => {
      return {
        value: prediction.place_id,
        label: prediction.description,
      };
    });
  };

  const handleCountrySelection = async (country: Option | null) => {
    if (!country) return;
    const place = await Google.searchPlace(country.value as string);
    if (!place) return;
    const countryCode = Google.getCountryCode(place) || "";
    onSelect({ value: countryCode, label: country.label });
  };

  const handleSearchCountries = (inputValue: string) => 
    new Promise<Option[]>((resolve) => {
      Google.searchCountry(inputValue).then((items) => {
        resolve(formatAutocompleteResult(items));
      });
    });

  const handleOnChange = (inputValue: string) => {
    if (onChange) onChange(inputValue);
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) onBlur(e);
  };

  return (
    <AsyncSelect
      id={id ? `${id}-country-autocomplete` : "country-autocomplete"}
      isMulti={false}
      value={value}
      noOptionsMessage={(i) => (!i.inputValue ? placeholder : noResultsText)}
      placeholder={placeholder}
      loadOptions={handleSearchCountries}
      onChange={handleCountrySelection}
      onInputChange={handleOnChange}
      onBlur={handleOnBlur}
      cacheOptions={true}
      defaultOptions={true}
      isDisabled={disabled}
    />
  );
};
