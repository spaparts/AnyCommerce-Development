/* **************************************************************

   Copyright 2011 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

var _store_spa = function() {
	var r= {
		vars : {
			catTemplates : {
				".featured_items" : "categoryFeaturedProductsTemplate",
			},
            searchSize : 4
		},
		
		callbacks : {
			init : {
				onSuccess : function(){
					app.u.dump('BEGIN app.ext_store_spa.callbacks.init.onSuccess');
					 //BEGIN RELATED CATEGORY LIST FOR PRODUCT PAGE
					 //var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
						//app.rq.push(['templateFunction','productTemplate','onCompletes',function(P){
							//var $context = $(app.u.jqSelector('#', P.parentID));
							//app.ext._store_spa.u.loadRelatedItemsForProd(app.ext.myRIA.vars.session.recentCategories[0], P, $context);
							//}]);
						//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
						//REACTIVATE AND REPLACE WITH A CATEGORY NAVPATH IF ANY CATEGORY PRODUCT LISTS NEED TO BE DISPLAYED ON THE HOMEPAGE.
					 /*
					 app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
                                        var $context = $(app.u.jqSelector('#'+infoObj.parentID));
                                        app.ext._store_spa.u.loadProductsAsList('.featured_items');
                                }]);
					*/
						//r = true;
		
						//return r;
				},
				onError : function() {
					app.u.dump('BEGIN app.ext_store_spa.callbacks.init.onError');
				}
			},
			startExtension : {
				onSuccess : function (){
					app.u.dump('BEGIN app.ext_store_spa.callbacks.startExtension.onSuccess')
				},
				onError : function (){
					app.u.dump('BEGIN ext_store_spa.callbacks.startExtension.onError');
				}
			},
			renderProductsAsList : {
					onSuccess : function(responseData) {
			//                app.u.dump(app.data[responseData.datapointer]);
							$('.homepageFeatProdList').anycontent({"templateID":"featuredItemsTemplate","datapointer":responseData.datapointer});
					},
					onError : function(responseData){
							app.u.dump('Error in extension: _store_spa_ renderProductsAsList');
							app.u.dump(responseData);
					}
			},
			populateRelatedItemsForProd : {
				onSuccess : function(rd){
						app.u.dump('BEGIN _store_spa.callbacks.populateRelatedItemsForProd.onSuccess');
						rd.$list.removeClass('loadingBG');
						rd.$list.anycontent({
								templateID : "productRelatedItemsListTemplate",
								datapointer : rd.datapointer
								});
						},
				onError : function(rd){
						app.u.dump('BEGIN store_thegrilllife.callbacks.populateRelatedItemsForProd.onError');
						}
			}
		},
		
		
		////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			headerManufacturerSelect : function() {
				var selectionValue = $("#headerManufacturerSelect").val();
				app.u.dump("selectionValue = " + selectionValue);
				
				switch(selectionValue){
					case AO:
						app.ext.myRIA.a.showContent('category',{'navcat':'.shop_by_brand.a_o_smith'});
					break;
					
					default:
					break;
				}
			}
		
		},//END a FUNCTIONS
		
		u : {
			loadProductsAsList :function(passedCat) {
                     app.u.dump("loadProductsAsList function started.");   
					var _tag = {
							"callback":"renderProductsAsList",
							"extension":"_store_spa"
					}
					app.ext.store_navcats.calls.appNavcatDetail.init(passedCat, _tag,'immutable');

					app.model.dispatchThis('immutable');
			
			}, //loadProductsAsList
			
			loadRelatedItemsForProd : function(recentCat, infoObj, $context){
				//Only render for products that have categories assigned
				if(app.data[infoObj.datapointer]['%attribs']['user:app_category']){
						//Check the recentCat against the product's categories. If we've come through search,
						//or from the homepage, a direct link elsewhere, or loaded the app on the prod pages,
						//recentCat will not be applicable (or in the latter case, nonexistent)
						var cats = app.data[infoObj.datapointer]['%attribs']['user:app_category'].split("\n");
						app.u.dump(cats);
						if(!recentCat || cats.indexOf(recentCat) === -1){
								recentCat = cats[0];
								}
						
						var $container = $('.relatedItems', $context);
						
						//To avoid re-running searches, we keep any rendered related items lists around for reference.
						//Iterate through them, hide any non-applicable ones.
						var thisCatIsRendered = false;
						$container.children().each(function(){
								if($(this).data('navcat') !== recentCat){
										$(this).hide();
										}
								else {
										thisCatIsRendered = true;
										$(this).show();
										}
								});
						//Haven't rendered this category yet, so let's give it a shot!
						if(!thisCatIsRendered){
								app.u.dump(recentCat+" has not yet been rendered");
								var $itemListContainer = $('<div class="loadingBG relatedItemsList" />');
								$itemListContainer.data('navcat', recentCat);
								
								var elasticsearch = app.ext.store_search.u.buildElasticRaw({
										"filter" : {
												"term" : {"app_category":recentCat}
												}
										});
								elasticsearch.size = app.ext._store_spa.vars.searchSize;
								
								var _tag = {
										callback : "populateRelatedItemsForProd",
										extension : "_store_spa",
										datapointer : "prodRelatedSearch|"+infoObj.pid+"|"+recentCat,
										$list : $itemListContainer
										}
								
								app.ext.store_search.calls.appPublicProductSearch.init(elasticsearch, _tag, "mutable");
								app.model.dispatchThis("mutable");
								
								
								$container.append($itemListContainer);
								}
						}
				}
			
		},//END u FUNCTIONS
		
		renderFormats : {
			wikiAndTruncText : function($tag,data)	{
				/*
				try not to barf in your mouth when you read this.
				The wiki translator doesn't like dealing with a jquery object (this will be addressed at some point).
				it needs a dom element. so a hidden element is created and the wiki translator saves/modifies that.
				then the contents of that are saved into the target jquery object.
				*/
				var $tmp = $('<div \/>').attr('id','TEMP_'+$tag.attr('id')).hide().appendTo('body');
				var target = document.getElementById('TEMP_'+$tag.attr('id')); //### creole parser doesn't like dealing w/ a jquery object. fix at some point.
				myCreole.parse(target, data.value,{},data.bindData.wikiFormats);
				$tag.append($tmp.html());
				var o = app.u.truncate($tag.text(),data.bindData.numCharacters)
				$tag.text(o);
				$tmp.empty().remove();
			},
			
			productRelatedCategoryList : function($tag,data)	{
//				app.u.dump("BEGIN store_navcats.renderFormats.categoryList");
				if(typeof data.value == 'object' && data.value.length > 0)	{
					var L = data.value.length;
					var call = 'appNavcatDetail';
					var numRequests = 0;
//The process is different depending on whether or not 'detail' is set.  detail requires a call for additional data.
//detail will be set when more than the very basic information about the category is displayed (thumb, subcats, etc)
					if(data.bindData.detail)	{
						if(data.bindData.detail == 'min')	{} //uses default call
						else if(data.bindData.detail == 'more' || data.bindData.detail == 'max')	{
							call = call+(data.bindData.detail.charAt(0).toUpperCase() + data.bindData.detail.slice(1)); //first letter of detail needs to be uppercase
							}
						else	{
							app.u.dump("WARNING! invalid value for 'detail' in productRelatedCategoryList renderFunction");
							}
						for(var i = 0; i < L; i += 1)	{
// *** 201344 null pretty name is NOT a hidden category. But we have to check to avoid a null ptr error. -mc
							if(!data.value[i].pretty || data.value[i].pretty[0] != '!')	{
// ** 201336+ appNavcatDetail id param changed to path -mc
// *** 201338 Missed a few references to id here -mc
								var parentID = data.value[i].path+"_catgid+"+(app.u.guidGenerator().substring(10));
								$tag.append(app.renderFunctions.createTemplateInstance(data.bindData.loadsTemplate,{'id':parentID,'catsafeid':data.value[i].path}));
								numRequests += app.ext.store_navcats.calls[call].init(data.value[i].path,{'parentID':parentID,'callback':'translateTemplate'});
								}
							}
						if(numRequests)	{app.model.dispatchThis()}
						}
//if no detail level is specified, only what is in the actual value (typically, id, pretty and @products) will be available. Considerably less data, but no request per category.
					else	{
						for(var i = 0; i < L; i += 1)	{
// ** 201336+ appNavcatDetail id param changed to path -mc
							var parentID = data.value[i].path+"_catgid+"+(app.u.guidGenerator().substring(10));
							if(data.value[i].pretty[0] != '!')	{
								$tag.append(app.renderFunctions.transmogrify({'id':parentID,'catsafeid':data.value[i].path},data.bindData.loadsTemplate,data.value[i]));
								}
							}
						}
					}
				else	{
					//value isn't an object or is empty. perfectly normal to get here if a page has no subs.
					}
				},
			
		}
	}
	return r;
}