# Country Autocomplete

This is a simple, reusable country dropdown component for your web applications. It uses Google's Places and Geocoding API to fetch the list of countries. 

The advantage of using Google API is that we can search for countries in any language. For example, if you search for "India" in Hindi, you will get the same result as if you searched for "India" in English.

Demo: https://country-autocomplete.vercel.app/

## Installation

```sh
yarn add country-autocomplete
```

## Prerequisites

This component requires a Google API key to function correctly. You need to provide your own API key in order to use this component. You can get your API key from [here](https://developers.google.com/places/web-service/get-api-key).

Once you have the key, add it to your environment variables:

```
GOOGLE_API_KEY=<your-api-key>
```

Replace `<your-api-key>` with your actual API key.

## Usage

```js
import React from 'react';
import CountryAutocomplete from 'country-autocomplete';

const App = () => {
  const [country, setCountry] = React.useState('');

  return (
    <div>
      <CountryAutocomplete
        value={country}
        onSelect={setCountry}
      />
    </div>
  );
};
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| id | string | The ID for the input field. |
| value | Option | The current selected value. |
| onSelect | (value: Option) => void | Callback function when a country from the autocomplete list is selected. |
| onChange | (value: string) => void | Callback function when the input value changes. |
| onBlur | (event: React.FocusEvent) => void | Callback function when the input field loses focus. |
| disabled | boolean | If true, the input field is disabled. |
| placeholder | string | Placeholder text for the input field. |
| noResultsText | string | Text to display when there are no results found. |

## Contribute

- Clone the repository
- Run `npm install` to install the dependencies
- Develop! 🎉