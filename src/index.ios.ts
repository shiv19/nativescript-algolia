/**********************************************************************************
* (c) 2017, Arpit Srivastava.
* Licensed under the MIT license.
*
* Version 0.0.1                                              arpit2438735@gmail.com
**********************************************************************************/
'use strict';

/// <reference path="./Algolia.ios.d.ts" />

import { AlgoliaIndex } from './algolia-index';
import {
    convertToJSON,
    buildQuery,
} from './utils';

let client;

export class Algolia{

  constructor(appID: string, apiKey: string) {
    client = Client.alloc();
    client.initWithAppIDApiKey(appID, apiKey);
  };

  public initIndex(name:string) : AlgoliaIndex {
    return new AlgoliaIndex(client, name)
  }

  public search(queries:Array<queryObject>, handler:Function):void {
      let indexQueries = [];

      queries.forEach((query)=> {
          let _query = Query.alloc().initWithQuery(query.query);

          if (query.params) {

              Object.keys(query.params).forEach((key)=> {
                  if (key === 'aroundRadius' && query.params[key] === 'all') {
                      _query.setParameterWithNameTo('aroundRadius', 'all');
                  } else {
                      _query[key] = buildQuery(key, query.params[key]);
                  }
              });
          }
          indexQueries.push(IndexQuery.alloc().initWithIndexNameQuery(query.indexName, _query));
      });

      client.multipleQueriesStrategyCompletionHandler(indexQueries, null, (success, error) => {
          if(error) {
              return handler(null, {status: error.code, reason: error.localizedDescription});
          }

          return handler(convertToJSON(success));
      });
  }
}

