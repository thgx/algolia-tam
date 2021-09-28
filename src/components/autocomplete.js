import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';

// Instant Search Widgets
import { hits, searchBox, configure } from 'instantsearch.js/es/widgets';

// Autocomplete Templates
import autocompleteProductTemplate from '../templates/autocomplete-product';
import autocompleteSuggestionTemplate from '../templates/autocomplete-suggestion';

// Query suggestions
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

// Params
const appId = '98WT6QNUH0';
const apiKey = 'f221aad3051fcac0b4f7e43e4fe4fe38';
const searchIndex = 'algolia-sa-assignment';
const searchIndexQuery = 'algolia-sa-assignment_query_suggestions2';

/**
 * @class Autocomplete
 * @description Instant Search class to display content in the page's autocomplete
 */
class Autocomplete {
  /**
   * @constructor
   */
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(appId, apiKey);
    const searchClient = this._searchClient;

    this._searchInstance = instantsearch({
      indexName: searchIndex,
      searchClient: this._searchClient,
    });

    this._querySuggestionsInstance = createQuerySuggestionsPlugin({
      searchClient,
      indexName: searchIndexQuery,
      getSearchParams({ state }) {
        return { hitsPerPage: state.query ? 5 : 10 };
      },
    });

    //console.log(this._querySuggestionsInstance);
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
  _registerWidgets() {
    const autoCompleteQuery = autocomplete({
      container: '#autocomplete-query',
      plugins: [this._querySuggestionsInstance],
      openOnFocus: true,
      templates: { item: autocompleteSuggestionTemplate },
    });

    this._searchInstance.addWidgets([
      configure({
        hitsPerPage: 3,
      }),
      searchBox({
        container: '#searchbox',
      }),
      hits({
        container: '#autocomplete-hits',
        templates: { item: autocompleteProductTemplate },
      }),
    ]);
    

  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @return {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default Autocomplete;
