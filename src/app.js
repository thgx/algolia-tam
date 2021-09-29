import Autocomplete from './components/autocomplete';

class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
  }

  _initSearch() {
    this.autocompleteDropdown = new Autocomplete();
  }
}

const app = new SpencerAndWilliamsSearch();
