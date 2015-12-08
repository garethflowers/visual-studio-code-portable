/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/nls!vs/workbench/parts/search/browser/openFileHandler",["vs/nls","vs/nls!vs/workbench/parts/search/browser/openAnythingHandler"],function(e,t){return e.create("vs/workbench/parts/search/browser/openFileHandler",t)}),define("vs/nls!vs/workbench/parts/search/browser/openSymbolHandler",["vs/nls","vs/nls!vs/workbench/parts/search/browser/openAnythingHandler"],function(e,t){return e.create("vs/workbench/parts/search/browser/openSymbolHandler",t)});var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__decorate=this&&this.__decorate||function(e,t,n,r){if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)return Reflect.decorate(e,t,n,r);switch(arguments.length){case 2:return e.reduceRight(function(e,t){return t&&t(e)||e},t);case 3:return e.reduceRight(function(e,r){return void(r&&r(t,n))},void 0);case 4:return e.reduceRight(function(e,r){return r&&r(t,n,e)||e},r)}},__param=this&&this.__param||function(e,t){return function(n,r){t(n,r,e)}};define("vs/workbench/parts/search/common/searchModel",["require","exports","vs/base/common/async","vs/base/common/strings","vs/base/common/paths","vs/base/common/lifecycle","vs/base/common/collections","vs/base/common/eventEmitter","vs/editor/common/editorCommon","vs/editor/common/core/range","vs/editor/common/services/modelService"],function(e,t,n,r,o,i,s,a,c,u,h){var l=function(){function e(e,t,n,r,o){this._parent=e,this._lineText=t,this._id=e.id()+">"+n+">"+r,this._range=new u.Range(1+n,1+r,1+n,1+r+o)}return e.prototype.id=function(){return this._id},e.prototype.parent=function(){return this._parent},e.prototype.text=function(){return this._lineText},e.prototype.range=function(){return this._range},e.prototype.preview=function(){var e=this._lineText.substring(0,this._range.startColumn-1),t=this._lineText.substring(this._range.startColumn-1,this._range.endColumn-1),n=this._lineText.substring(this._range.endColumn-1,Math.min(this._range.endColumn+150,this._lineText.length));return e=r.lcut(e,26),{before:e,inside:t,after:n}},e}();t.Match=l;var p=function(e){function t(t){e.call(this,t,null,Date.now(),Date.now(),Date.now())}return __extends(t,e),t}(l);t.EmptyMatch=p;var d=function(){function e(e,t){this._resource=t,this._parent=e,this._matches=Object.create(null)}return e.prototype.dispose=function(){},e.prototype.id=function(){return this.resource().toString()},e.prototype.parent=function(){return this._parent},e.prototype.add=function(e){this._matches[e.id()]=e},e.prototype.remove=function(e){delete this._matches[e.id()]},e.prototype.matches=function(){return s.values(this._matches)},e.prototype.count=function(){var e=0;for(var t in this._matches)this._matches[t]instanceof p||(e+=1);return e},e.prototype.resource=function(){return this._resource},e.prototype.name=function(){return o.basename(this.resource().fsPath)},e}();t.FileMatch=d;var m=function(e){function t(t,r,o,i,s){var a=this;e.call(this,t,r),this._modelDecorations=[],this._unbind=[],this._query=o,this._model=i,this._diskFileMatch=s,this._updateScheduler=new n.RunOnceScheduler(this._updateMatches.bind(this),250),this._unbind.push(this._model.addListener(c.EventType.ModelContentChanged,function(e){return a._updateScheduler.schedule()})),this._updateMatches()}return __extends(t,e),t.prototype.dispose=function(){this._unbind=i.cAll(this._unbind),this._isTextModelDisposed()||this._model.deltaDecorations(this._modelDecorations,[])},t.prototype._updateMatches=function(){var e=this;if(!this._isTextModelDisposed()){this._matches=Object.create(null);var t=this._model.findMatches(this._query.pattern,this._model.getFullModelRange(),this._query.isRegExp,this._query.isCaseSensitive,this._query.isWordMatch);0===t.length?this.add(new p(this)):t.forEach(function(t){return e.add(new l(e,e._model.getLineContent(t.startLineNumber),t.startLineNumber-1,t.startColumn-1,t.endColumn-t.startColumn))}),this.parent().emit("changed",this),this.updateHighlights()}},t.prototype.updateHighlights=function(){this._model.isDisposed()||(this.parent()._showHighlights?this._modelDecorations=this._model.deltaDecorations(this._modelDecorations,this.matches().filter(function(e){return!(e instanceof p)}).map(function(e){return{range:e.range(),options:t.DecorationOption}})):this._modelDecorations=this._model.deltaDecorations(this._modelDecorations,[]))},t.prototype._isTextModelDisposed=function(){return!this._model||this._model.isDisposed()},t.DecorationOption={stickiness:c.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,className:"findMatch",overviewRuler:{color:"rgba(246, 185, 77, 0.7)",darkColor:"rgba(246, 185, 77, 0.7)",position:c.OverviewRulerLane.Center}},t}(d);t.LiveFileMatch=m;var f=function(e){function t(t,n){e.call(this),this._disposables=[],this._matches=Object.create(null),this._modelService=n,this._query=t,this._query&&(this._modelService.onModelAdded.add(this._onModelAdded,this,this._disposables),this._modelService.onModelRemoved.add(this._onModelRemoved,this,this._disposables))}return __extends(t,e),t.prototype._onModelAdded=function(e){var t=e.getAssociatedResource(),n=this._matches[t.toString()];if(n){var r=new m(this,t,this._query,e,n);r.updateHighlights(),this._matches[t.toString()]=r,this.emit("changed",this)}},t.prototype._onModelRemoved=function(e){var t=this,n=e.getAssociatedResource(),r=this._matches[n.toString()];r instanceof m&&this.deferredEmit(function(){t.remove(r),t._matches[n.toString()]=r._diskFileMatch})},t.prototype.append=function(e){var t=this;e.forEach(function(e){var n=t._getOrAdd(e);n instanceof m&&(n=n._diskFileMatch),e.lineMatches.forEach(function(e){e.offsetAndLengths.forEach(function(t){var r=new l(n,e.preview,e.lineNumber,t[0],t[1]);n.add(r)})})})},t.prototype._getOrAdd=function(e){var t=this;return s.lookupOrInsert(this._matches,e.resource.toString(),function(){var n=t._modelService.getModel(e.resource),r=new d(t,e.resource);return n&&t._query&&(r=new m(t,e.resource,t._query,n,r)),r})},t.prototype.remove=function(e){delete this._matches[e.resource().toString()],e.dispose(),this.emit("changed",this)},t.prototype.matches=function(){return s.values(this._matches)},t.prototype.isEmpty=function(){return 0===this.fileCount()},t.prototype.fileCount=function(){return Object.keys(this._matches).length},t.prototype.count=function(){return this.matches().reduce(function(e,t){return e+t.count()},0)},t.prototype.toggleHighlights=function(e){if(this._showHighlights!==e){this._showHighlights=e;for(var t in this._matches){var n=this._matches[t];n instanceof m&&n.updateHighlights()}}},t.prototype.dispose=function(){this._disposables=i.disposeAll(this._disposables),i.disposeAll(this.matches()),e.prototype.dispose.call(this)},t=__decorate([__param(1,h.IModelService)],t)}(a.EventEmitter);t.SearchResult=f});var __decorate=this&&this.__decorate||function(e,t,n,r){if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)return Reflect.decorate(e,t,n,r);switch(arguments.length){case 2:return e.reduceRight(function(e,t){return t&&t(e)||e},t);case 3:return e.reduceRight(function(e,r){return void(r&&r(t,n))},void 0);case 4:return e.reduceRight(function(e,r){return r&&r(t,n,e)||e},r)}},__param=this&&this.__param||function(e,t){return function(n,r){t(n,r,e)}};define("vs/workbench/parts/search/common/searchQuery",["require","exports","vs/base/common/objects","vs/platform/search/common/search","vs/platform/configuration/common/configuration"],function(e,t,n,r,o){function i(e){var t=e&&e.files&&e.files.exclude,r=e&&e.search&&e.search.exclude;if(!t&&!r)return null;if(!t||!r)return t||r;var o=Object.create(null);return o=n.mixin(o,t),o=n.mixin(o,r,!0)}t.getExcludes=i;var s=function(){function e(e){this.configurationService=e}return e.prototype.text=function(e,t){return this.query(r.QueryType.Text,e,t)},e.prototype.file=function(e){return this.query(r.QueryType.File,null,e)},e.prototype.query=function(e,t,r){return void 0===r&&(r={}),this.configurationService.loadConfiguration().then(function(o){var s=i(o);return r.excludePattern?n.mixin(r.excludePattern,s,!1):r.excludePattern=s,{type:e,rootResources:r.rootResources,filePatterns:r.filePatterns||[],excludePattern:r.excludePattern,includePattern:r.includePattern,maxResults:r.maxResults,fileEncoding:r.fileEncoding,contentPattern:t}})},e=__decorate([__param(0,o.IConfigurationService)],e)}();t.QueryBuilder=s});var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__decorate=this&&this.__decorate||function(e,t,n,r){if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)return Reflect.decorate(e,t,n,r);switch(arguments.length){case 2:return e.reduceRight(function(e,t){return t&&t(e)||e},t);case 3:return e.reduceRight(function(e,r){return void(r&&r(t,n))},void 0);case 4:return e.reduceRight(function(e,r){return r&&r(t,n,e)||e},r)}},__param=this&&this.__param||function(e,t){return function(n,r){t(n,r,e)}};define("vs/workbench/parts/search/browser/openFileHandler",["require","exports","vs/base/common/winjs.base","vs/nls!vs/workbench/parts/search/browser/openFileHandler","vs/base/common/async","vs/base/common/paths","vs/base/common/labels","vs/base/common/strings","vs/base/parts/quickopen/browser/quickOpenModel","vs/base/common/filters","vs/base/common/comparers","vs/workbench/browser/quickopen","vs/workbench/parts/search/common/searchModel","vs/workbench/parts/search/common/searchQuery","vs/workbench/parts/files/common/files","vs/workbench/services/editor/common/editorService","vs/platform/configuration/common/configuration","vs/platform/instantiation/common/instantiation","vs/platform/message/common/message","vs/platform/search/common/search","vs/platform/workspace/common/workspace"],function(e,t,n,r,o,i,s,a,c,u,h,l,p,d,m,f,_,v,g,y,b){var S=function(e){function t(t,n,r,o,a,c){e.call(this,o),this.instantiationService=a,this.resource=n,this.name=t,this.description=s.getPathLabel(i.dirname(this.resource.fsPath),c),this.setHighlights(r)}return __extends(t,e),t.prototype.getLabel=function(){return this.name},t.prototype.getDescription=function(){return this.description},t.prototype.getIcon=function(){return"file"},t.prototype.getResource=function(){return this.resource},t.prototype.setRange=function(e){this.range=e},t.prototype.getInput=function(){var e={resource:this.resource};return this.range&&(e.options={selection:this.range}),e},t=__decorate([__param(3,f.IWorkbenchEditorService),__param(4,v.IInstantiationService),__param(5,b.IWorkspaceContextService)],t)}(l.EditorQuickOpenEntry);t.FileEntry=S;var w=function(e){function t(n,r,i,s,a,c,u){e.call(this),this.editorService=n,this.messageService=r,this.instantiationService=i,this.configurationService=s,this.contextService=a,this.textFileService=c,this.searchService=u,this.queryBuilder=this.instantiationService.createInstance(d.QueryBuilder),this.delayer=new o.ThrottledDelayer(t.SEARCH_DELAY),this.isStandalone=!0}return __extends(t,e),t.prototype.setStandalone=function(e){this.delayer=e?new o.ThrottledDelayer(t.SEARCH_DELAY):null,this.isStandalone=e},t.prototype.getResults=function(e){var t=this;e=e.trim();var r;return r=e?this.delayer?this.delayer.trigger(function(){return t.doFindResults(e)}):this.doFindResults(e):n.TPromise.as([]),r.then(function(e){return new c.QuickOpenModel(e)})},t.prototype.doFindResults=function(e){var t=this;this.cancelPendingSearch();var n=this.textFileService.getWorkingFilesModel().getOutOfWorkspaceContextEntries().map(function(e){return e.resource});this.contextService.getWorkspace()&&n.push(this.contextService.getWorkspace().resource);var r={filePatterns:[{pattern:e}],rootResources:n};return this.queryBuilder.file(r).then(function(e){return t.pendingSearch=t.searchService.search(e),t.pendingSearch}).then(function(n){t.pendingSearch=null;var r=t.instantiationService.createInstance(p.SearchResult,null);r.append(n.results);var o=[],i=r.matches();t.isStandalone&&(i=i.sort(function(n,r){return t.sort(n,r,e.toLowerCase())}));for(var s=0;s<i.length;s++){var a=i[s],c=u.matchesFuzzy(e,a.name());o.push(t.instantiationService.createInstance(S,a.name(),a.resource(),c))}return o})},t.prototype.sort=function(e,t,n){var r=e.name().toLowerCase(),o=t.name().toLowerCase(),i=0===r.indexOf(n),s=0===o.indexOf(n);if(i!==s)return i?-1:1;var c=h.compareFileNames(r,o);return 0!==c?c:a.localeCompare(e.resource().fsPath,t.resource().fsPath)},t.prototype.getGroupLabel=function(){return r.localize(0,null)},t.prototype.getAutoFocus=function(e){return{autoFocusFirstEntry:!0}},t.prototype.cancelPendingSearch=function(){this.pendingSearch&&(this.pendingSearch.cancel(),this.pendingSearch=null)},t.prototype.onClose=function(e){this.cancelPendingSearch()},t.SEARCH_DELAY=500,t=__decorate([__param(0,f.IWorkbenchEditorService),__param(1,g.IMessageService),__param(2,v.IInstantiationService),__param(3,_.IConfigurationService),__param(4,b.IWorkspaceContextService),__param(5,m.ITextFileService),__param(6,y.ISearchService)],t)}(l.QuickOpenHandler);t.OpenFileHandler=w});var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__decorate=this&&this.__decorate||function(e,t,n,r){if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)return Reflect.decorate(e,t,n,r);switch(arguments.length){case 2:return e.reduceRight(function(e,t){return t&&t(e)||e},t);case 3:return e.reduceRight(function(e,r){return void(r&&r(t,n))},void 0);case 4:return e.reduceRight(function(e,r){return r&&r(t,n,e)||e},r)}},__param=this&&this.__param||function(e,t){return function(n,r){t(n,r,e)}};define("vs/workbench/parts/search/browser/openSymbolHandler",["require","exports","vs/base/common/winjs.base","vs/nls!vs/workbench/parts/search/browser/openSymbolHandler","vs/base/common/errors","vs/base/common/async","vs/base/common/strings","vs/platform/platform","vs/workbench/browser/quickopen","vs/base/parts/quickopen/browser/quickOpenModel","vs/editor/common/modes/modesRegistry","vs/base/common/filters","vs/base/common/labels","vs/workbench/services/editor/common/editorService","vs/platform/instantiation/common/instantiation","vs/platform/workspace/common/workspace","vs/editor/common/services/modeService","../common/search"],function(e,t,n,r,o,i,s,a,c,u,h,l,p,d,m,f,_,v){var g=function(e){function t(t,n,r,o,i,s,a,c){e.call(this,c),this.name=t,this.parameters=n,this.description=r,this.resource=o,this.type=i,this.range=s,this.setHighlights(a)}return __extends(t,e),t.prototype.getLabel=function(){return this.name+this.parameters},t.prototype.getName=function(){return this.name},t.prototype.getParameters=function(){return this.parameters},t.prototype.getDescription=function(){return this.description},t.prototype.getType=function(){return this.type},t.prototype.getIcon=function(){return this.type},t.prototype.getInput=function(){var e={resource:this.resource};return this.range&&(e.options={selection:{startLineNumber:this.range.startLineNumber,startColumn:this.range.startColumn}}),e},t}(c.EditorQuickOpenEntry),y=function(e){function t(n,r,o,s){e.call(this),this.editorService=n,this.modeService=r,this.instantiationService=o,this.contextService=s,this.delayer=new i.ThrottledDelayer(t.SEARCH_DELAY),this.isStandalone=!0}return __extends(t,e),t.prototype.setStandalone=function(e){this.delayer=e?new i.ThrottledDelayer(t.SEARCH_DELAY):null,this.isStandalone=e},t.prototype.canRun=function(){return!0},t.prototype.getResults=function(e){var t=this;e=e.trim();var r;return r=e?this.delayer?this.delayer.trigger(function(){return t.doGetResults(e)}):this.doGetResults(e):n.TPromise.as([]),r.then(function(e){return new u.QuickOpenModel(e)})},t.prototype.doGetResults=function(e){var t=this,r=(a.Registry.as(h.Extensions.EditorModes),[]),i=v.NavigateTypesSupportRegistry.getAll().map(function(t){return t.getNavigateToItems(e).then(function(e){Array.isArray(e)&&r.push.apply(r,e)},function(e){o.onUnexpectedError(e)})});return n.TPromise.join(i).then(function(){return t.toQuickOpenEntries(r,e)})},t.prototype.toQuickOpenEntries=function(e,n){var r=this,o=[];return e.forEach(function(e){if(t.SUPPORTED_OPEN_TYPES.some(function(t){return e.type===t})){var i=l.matchesFuzzy(n,e.name);if(i){var s=e.resourceUri;if("file"===s.scheme){var a=p.getPathLabel(s,r.contextService),c=void 0;c=e.containerName===a?a:e.containerName===s.toString()&&e.containerName.indexOf("/")>=0?e.containerName.substr(e.containerName.lastIndexOf("/")+1):e.containerName&&e.containerName.indexOf(".")>=0?e.containerName.substr(e.containerName.lastIndexOf(".")+1):e.containerName||a,o.push(new g(e.name,e.parameters,c,s,e.type,e.range,i,r.editorService))}}}}),this.isStandalone?o.sort(this.sort.bind(this,n.toLowerCase())):o},t.prototype.sort=function(e,n,r){var o=n.getName().toLowerCase(),i=r.getName().toLowerCase(),a=s.localeCompare(o,i);if(0!==a)return a;var c=n.getType(),u=r.getType();return c!==u?t.SUPPORTED_OPEN_TYPES.indexOf(c)<t.SUPPORTED_OPEN_TYPES.indexOf(u)?-1:1:0},t.prototype.getGroupLabel=function(){return r.localize(0,null)},t.prototype.getEmptyLabel=function(e){return e.length>0?r.localize(1,null):r.localize(2,null)},t.prototype.getAutoFocus=function(e){return{autoFocusFirstEntry:!0,autoFocusPrefixMatch:e.trim()}},t.SUPPORTED_OPEN_TYPES=["class","interface","enum","function","method"],t.SEARCH_DELAY=500,t=__decorate([__param(0,d.IWorkbenchEditorService),__param(1,_.IModeService),__param(2,m.IInstantiationService),__param(3,f.IWorkspaceContextService)],t)}(c.QuickOpenHandler);t.OpenSymbolHandler=y});var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__decorate=this&&this.__decorate||function(e,t,n,r){if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)return Reflect.decorate(e,t,n,r);switch(arguments.length){case 2:return e.reduceRight(function(e,t){return t&&t(e)||e},t);case 3:return e.reduceRight(function(e,r){return void(r&&r(t,n))},void 0);case 4:return e.reduceRight(function(e,r){return r&&r(t,n,e)||e},r)}},__param=this&&this.__param||function(e,t){return function(n,r){t(n,r,e)}};define("vs/workbench/parts/search/browser/openAnythingHandler",["require","exports","vs/base/common/winjs.base","vs/nls!vs/workbench/parts/search/browser/openAnythingHandler","vs/base/common/async","vs/base/common/types","vs/base/common/strings","vs/base/common/filters","vs/base/common/comparers","vs/base/parts/quickopen/browser/quickOpenModel","vs/workbench/browser/quickopen","vs/workbench/parts/search/browser/openFileHandler","vs/workbench/parts/search/browser/openSymbolHandler","vs/platform/message/common/message","vs/platform/instantiation/common/instantiation"],function(e,t,n,r,o,i,s,a,c,u,h,l,p,d,m){t.OpenSymbolHandler=p.OpenSymbolHandler;var f=function(e){function t(n,r){e.call(this),this.messageService=n,this.openSymbolHandler=r.createInstance(p.OpenSymbolHandler),this.openFileHandler=r.createInstance(l.OpenFileHandler),this.openSymbolHandler.setStandalone(!1),this.openFileHandler.setStandalone(!1),this.resultsToSearchCache={},this.delayer=new o.ThrottledDelayer(t.SEARCH_DELAY)}return __extends(t,e),t.prototype.getResults=function(e){var r=this;if(e=e.trim(),this.isClosed=!1,!e)return n.TPromise.as(new u.QuickOpenModel);var o=this.findRange(e);if(o){var i=e.indexOf("#")>=0?e.indexOf("#"):e.indexOf(":");i>=0&&(e=e.substring(0,i))}var a=this.getResultsFromCache(e,o);if(a)return n.TPromise.as(new u.QuickOpenModel(a));var h=function(){var i=!1,a=[];if(o)a.push(n.Promise.as(new u.QuickOpenModel));else{var h=function(e){return n.TPromise.timeout(e).then(function(){return i?n.Promise.as(new u.QuickOpenModel):h(t.SYMBOL_SEARCH_SUBSEQUENT_TIMEOUT)})},p=r.openSymbolHandler.getResults(e),m=h(t.SYMBOL_SEARCH_INITIAL_TIMEOUT);a.push(n.Promise.any([p,m]).then(function(e){return e.value}))}return a.push(r.openFileHandler.getResults(e).then(function(e){return i=!0,e})),n.TPromise.join(a).then(function(t){if(r.isClosed)return n.TPromise.as(new u.QuickOpenModel);var i=t[0].entries.concat(t[1].entries),a=s.stripWildcards(e.toLowerCase());return i.sort(function(e,t){return c.compareAnything(e.getLabel(),t.getLabel(),a)}),i.forEach(function(e){e instanceof l.FileEntry&&e.setRange(o)}),r.resultsToSearchCache[e]=i,n.TPromise.as(new u.QuickOpenModel(i))},function(e){r.messageService.show(d.Severity.Error,e)})};return this.delayer.trigger(h)},t.prototype.findRange=function(e){var n=null,r=t.LINE_COLON_PATTERN.exec(e);if(r&&r.length>1){var o=parseInt(r[1],10);if(i.isNumber(o)){if(n={startLineNumber:o,startColumn:1,endLineNumber:o,endColumn:1},r.length>3){var s=parseInt(r[3],10);i.isNumber(s)&&(n.startColumn=s,n.endColumn=s)}}else""===r[1]&&(n={startLineNumber:1,startColumn:1,endLineNumber:1,endColumn:1})}return n},t.prototype.getResultsFromCache=function(e,t){void 0===t&&(t=null);var n;for(var r in this.resultsToSearchCache)if(this.resultsToSearchCache.hasOwnProperty(r)&&0===e.indexOf(r)){n=this.resultsToSearchCache[r];break}if(!n)return null;for(var o=[],i=0;i<n.length;i++){var u=n[i];if(!t||u instanceof l.FileEntry){var h=a.matchesFuzzy(e,u.getLabel());h&&(u.setHighlights(h),o.push(u))}}var p=s.stripWildcards(e.toLowerCase());return o.sort(function(e,t){return c.compareAnything(e.getLabel(),t.getLabel(),p)}),o.forEach(function(e){e instanceof l.FileEntry&&e.setRange(t)}),o},t.prototype.getGroupLabel=function(){return r.localize(0,null)},t.prototype.getAutoFocus=function(e){return{autoFocusFirstEntry:!0}},t.prototype.onClose=function(e){this.isClosed=!0,this.resultsToSearchCache={},this.openSymbolHandler.onClose(e),this.openFileHandler.onClose(e)},t.LINE_COLON_PATTERN=/[#|:](\d*)([#|:](\d*))?$/,t.SYMBOL_SEARCH_INITIAL_TIMEOUT=500,t.SYMBOL_SEARCH_SUBSEQUENT_TIMEOUT=100,t.SEARCH_DELAY=100,t=__decorate([__param(0,d.IMessageService),__param(1,m.IInstantiationService)],t)}(h.QuickOpenHandler);t.OpenAnythingHandler=f});