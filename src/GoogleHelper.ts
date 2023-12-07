declare global {
  interface Window {
    resolveMapPromise?: () => void;
  }
}

export class GoogleHelper {
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private key: string | null = null;
  private mapsLoaded: boolean = false;

  constructor(googleMapsKey: string) {
    this.key = googleMapsKey;
    this.initialize();
  }

  async initialize() {
    await this.loadMapsSdk();
    await this.registerAutocompleteService();
    await this.registerGeocoder();
  }

  private loadMapsSdk(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.key}&libraries=places&callback=resolveMapPromise`;
      script.async = true;
      document.head.appendChild(script);
      window.resolveMapPromise = () => {
        this.mapsLoaded = true;
        resolve();
      };
    });
  }

  private async registerAutocompleteService(): Promise<void> {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
  }

  private async registerGeocoder(): Promise<void> {
    this.geocoder = new window.google.maps.Geocoder();
  }

  searchCountry(search: string): Promise<google.maps.places.AutocompletePrediction[] | null> {
     if(!this.mapsLoaded) {
      return new Promise((resolve) => resolve(null));
     }
    return new Promise<google.maps.places.AutocompletePrediction[] | null>((resolve) => {
      this.autocompleteService?.getPlacePredictions({ input: search, types: ["(regions)"] }, (predictions) => {
        if (!predictions) {
          resolve(null);
        } else {
          resolve(predictions.filter((prediction) => prediction.types.includes("country")) || null);
        }
      });
    });
  }

  searchPlace(search: string): Promise<google.maps.GeocoderResult | null> {
    if(!this.mapsLoaded) {
      return new Promise((resolve) => resolve(null));
     }
    return new Promise((resolve) => {
      this.geocoder?.geocode({ placeId: search }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      });
    });
  }

  getCountryCode(place: google.maps.places.PlaceResult): string | false {
    const addressComponents = place.address_components || [];
    for (const component of addressComponents) {
      if (component.types.includes("country")) {
        return component.short_name || false;
      }
      if (component.types.length === 2 && component.types.includes("political")) {
        return component.short_name || false;
      }
    }
    return false;
  }
}

export default GoogleHelper;
