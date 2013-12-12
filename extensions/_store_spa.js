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
					 //REACTIVATE AND REPLACE WITH A CATEGORY NAVPATH IF ANY CATEGORY PRODUCT LISTS NEED TO BE DISPLAYED ON THE HOMEPAGE.
					 /*
					 app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
                                        var $context = $(app.u.jqSelector('#'+infoObj.parentID));
                                        app.ext._store_spa.u.loadProductsAsList('.featured_items');
                                }]);
					*/
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
			
		}
	}
	return r;
}