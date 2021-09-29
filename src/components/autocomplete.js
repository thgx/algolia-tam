/** @jsx h */
import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { h, Fragment } from 'preact';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
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
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */
  _registerClient() {
    this.searchClient = algoliasearch(appId, apiKey);

    const searchClient = this.searchClient;
    this._searchInstance = instantsearch({
      indexName: searchIndex,
      searchClient: this.searchClient,
    });

    this._querySuggestionsInstance = createQuerySuggestionsPlugin({
      searchClient,
      indexName: searchIndexQuery,
      getSearchParams({ state }) {
        return { hitsPerPage: state.query ? 10 : 15 };
      },
    });

    this._recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'navbar',
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
  _registerWidgets() {
    const searchClient = this.searchClient;
    autocomplete({
      container: '#autocomplete-query',
      plugins: [this._querySuggestionsInstance, this._recentSearchesPlugin],
      openOnFocus: true,
      debug: true,
      // templates: { item: autocompleteSuggestionTemplate },
      getSources({ query }) {
        if (!query) {
          return [];
        }
        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: searchIndex,
                    query,
                    params: {
                      hitsPerPage: 3,
                      attributesToSnippet: ['name:10'],
                      snippetEllipsisText: '…',
                    },
                  },
                ],
              });
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Products</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item(data) {
                return (
                  <div class="autocomplete-product">
                    <div class="autocomplete-product__image-container">
                      <img class="autocomplete-product__image" src={data.item.image} />
                    </div>
                    <div class="autocomplete-product__details">
                      <h3 class="autocomplete-product__name">
                        <a href={data.item.url}>{data.item.name}</a>
                      </h3>
                      <p class="autocomplete-product__price">{data.item.price} €</p>
                    </div>
                  </div>
                );
              },
              noResults() {
                return 'No products for this query.';
              },
            },
            noResults() {
              return 'No products for this query.';
            },
          },
        ];
      },
    });
  }
}
export default Autocomplete;
