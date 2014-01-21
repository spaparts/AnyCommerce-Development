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
				//Help pages
				".featured_items" : "categoryFeaturedProductsTemplate",
				
				//Filter Cartridges custom cat page
				".filter_cartridges" : "spaFiltersCategoryTemplate"
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
			},
			//END headerManufacturerSelect
			
			clearCart : function() {
				var itemCount = $("#cartStuffList > li").length;
				app.u.dump("var itemCount = " + itemCount);
				for (var i=1;i<=itemCount;i++)
				{
					$(".qtyInput").val(0);
					//app.u.dump($("#cartStuffList li:nth-child("+i+") input.qtyInput"));	
					app.ext._store_spa.u.updateCartQty($("#cartStuffList li:nth-child("+i+") input.qtyInput")); 
				}
					app.model.dispatchThis('immutable');
			},
			//END clearCart
			
			termsOfAgreementClick : function() {
				if($(".checkoutTermsOfAgreementCB").is(':checked')){
					$(".checkoutPlaceOrderButton").css( "opacity", "1");
					$(".checkoutPlaceOrderButtonBlocker").hide();
				}
				else{
					$(".checkoutPlaceOrderButton").css( "opacity", "0.4");
					$(".checkoutPlaceOrderButtonBlocker").show();
				}
			},
			//END termsOfAgreementClick
			
			residentBusinessClick : function() {
				if($(".chkoutAddressBillTemplate input.checkoutResBusCB").data('checked') === false){
					$(".chkoutAddressBillTemplate div.bill_company").hide();
					$(".chkoutAddressShipTemplate div.ship_company").hide();
					$('.chkoutAddressBillTemplate input.checkoutResBusCB').data('checked',true).append();
					
				}
				else{
					$(".chkoutAddressBillTemplate div.bill_company").show();
					$(".chkoutAddressShipTemplate div.ship_company").show();
					$('.chkoutAddressBillTemplate input.checkoutResBusCB').data('checked',false).append();
				}
			},
			
			showDropdown : function($tag) {
					var $dropdown = $(".productListTemplateATCVariationsDropdownCont", $tag);
					var height = 200;
					$dropdown.stop().animate({"height":height+"px"}, 500);
					$(".productListTemplateATCVariationsDropdownCont", $tag).css({'border':'solid 1px #CAC4AE'});
				},
					
			hideDropdown : function($tag) {
					$(".productListTemplateATCVariationsDropdownCont", $tag).stop().animate({"height":"0px"}, 500);
					$(".productListTemplateATCVariationsDropdownCont", $tag).css({'border':'none'});
				},
				
			loginFrmSubmit : function(email,password,errorDiv)        {
					var errors = '';
					$errorDiv = errorDiv.empty(); //make sure error screen is empty. do not hide or callback errors won't show up.

					if(app.u.isValidEmail(email) == false){
							errors += "Please provide a valid email address<br \/>";
							}
					if(!password)        {
							errors += "Please provide your password<br \/>";
							}
					if(errors == ''){
							app.calls.appBuyerLogin.init({"login":email,"password":password},{'callback':'authenticateBuyer','extension':'myRIA'});
							app.calls.refreshCart.init({},'immutable'); //cart needs to be updated as part of authentication process.
//                                        app.calls.buyerProductLists.init('forgetme',{'callback':'handleForgetmeList','extension':'store_prodlist'},'immutable');
							app.model.dispatchThis('immutable');
							}
					else {
							$errorDiv.anymessage({'message':errors});
							}
					showContent('customer',{'show':'myaccount'})
			} //loginFrmSubmit		
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
				},
				
				updateCartQty : function($input,tagObj)	{
				
				var stid = $input.attr('data-stid');
				var qty = $input.val();
				
				if(stid && qty && !$input.hasClass('disabled'))	{
					$input.attr('disabled','disabled').addClass('disabled').addClass('loadingBG');
					app.u.dump('got stid: '+stid);
//some defaulting. a bare minimum callback needs to occur. if there's a business case for doing absolutely nothing
//then create a callback that does nothing. IMHO, you should always let the user know the item was modified.
//you can do something more elaborate as well, just by passing a different callback.
					tagObj = $.isEmptyObject(tagObj) ? {} : tagObj;
					tagObj.callback = tagObj.callback ? tagObj.callback : 'updateCartLineItem';
					tagObj.extension = tagObj.extension ? tagObj.extension : 'store_cart';
					tagObj.parentID = 'cartViewer_'+app.u.makeSafeHTMLId(stid);
/*
the request for quantity change needs to go first so that the request for the cart reflects the changes.
the dom update for the lineitem needs to happen last so that the cart changes are reflected, so a ping is used.
*/
					app.ext.store_cart.calls.cartItemUpdate.init(stid,qty);
					app.ext.store_cart.u.updateCartSummary();
//lineitem template only gets updated if qty > 1 (less than 1 would be a 'remove').
					if(qty >= 1)	{
						app.calls.ping.init(tagObj,'immutable');
						}
					else	{
						$('#cartViewer_'+app.u.makeSafeHTMLId(stid)).empty().remove();
						}
					}
				else	{
					app.u.dump(" -> a stid ["+stid+"] and a quantity ["+qty+"] are required to do an update cart.");
					}
				},
			handleAppLoginCreate : function($form)        {
				if($form)        {
						var formObj = $form.serializeJSON();
						
						if(formObj.pass !== formObj.pass2) {
								app.u.throwMessage('Sorry, your passwords do not match! Please re-enter your password');
								return;
						}
						
						formObj._vendor = "spaparts";
                                
                                formObj.todonote  = formObj.company+"\n";
                                formObj.todonote += formObj.address1+"\n";
                                if(formObj.address2 && formformObj.address2 !== ""){
                                        formObj.todonote += formObj.address2+"\n";
                                        }
                                formObj.todonote += formObj.city+","+formObj.region+" "+formObj.postal+"\n";
								formObj.todonote += formObj.email+"\n";
								formObj.todonote += formObj.phone+"\n";
                                formObj.todonote += "Date Created: "+(new Date()).toDateString();
						
						var tagObj = {
								'callback':function(rd) {
										if(app.model.responseHasErrors(rd)) {
												$form.anymessage({'message':rd});
										}
										else {
												showContent('customer',{'show':'myaccount'});
												app.u.throwMessage(app.u.successMsgObject("Your account has been created!"));
										}
								}
						}
						
						app.calls.appBuyerCreate.init(formObj,tagObj,'immutable');
						app.model.dispatchThis('immutable');
				}
				else {
						$('#globalMessaging').anymessage({'message':'$form not passed into _store_spa.u.handleBuyerAccountCreate','gMessage':true});
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
				app.u.dump ("data.value = " + data.value);
				var navCats = data.value.split("\n");
				app.u.dump ("navCats = " + navCats[0]);
				var L = navCats.length;
				var call = 'appNavcatDetail';
				var numRequests = 0;
				for(var i = 0; i < L; i += 1)	{
					var parentID = navCats[i]+"_catgid+"+(app.u.guidGenerator().substring(10));
					$tag.append(app.renderFunctions.createTemplateInstance(data.bindData.loadsTemplate,{'id':parentID,'catsafeid':navCats[i]}));
					numRequests += app.ext.store_navcats.calls[call].init(navCats[i],{'parentID':parentID,'callback':'translateTemplate'});
				}
				if(numRequests)	{app.model.dispatchThis()}
			},
			
			atcVariations : function($tag,data)	{
//				app.u.dump("BEGIN store_product.renderFormats.atcVariations");
				var pid = data.value; 
				var formID = $tag.closest('form').attr('id'); //move up the dom tree till the parent form is found
				$tag.empty(); /* prodlist fix */
//				app.u.dump(" -> pid: "+pid);
//				app.u.dump(" -> formID: "+formID);
				
				if(app.ext.store_product.u.productIsPurchaseable(pid))	{
//					app.u.dump(" -> item is purchaseable.");
					if(!$.isEmptyObject(app.data['appProductGet|'+pid]['@variations']) && app.model.countProperties(app.data['appProductGet|'+pid]['@variations']) > 0)	{
						$("<div \/>").attr('id','JSONpogErrors_'+pid).addClass('zwarn').appendTo($tag);
						
						//Hides variation section of accessory if no variations are present
						//app.u.dump($tag);
						$tag.parent().parent().show();
					
						var $display = $("<div \/>"); //holds all the pogs and is appended to at the end.
						
						pogs = new handlePogs(app.data['appProductGet|'+pid]['@variations'],{"formId":formID,"sku":pid});
						var pog;
						if(typeof pogs.xinit === 'function')	{pogs.xinit()}  //this only is needed if the class is being extended (custom sog style).
						var ids = pogs.listOptionIDs();
						for ( var i=0, len=ids.length; i<len; ++i) {
							pog = pogs.getOptionByID(ids[i]);
							$display.append(pogs.renderOption(pog,pid));
							}
						$display.appendTo($tag);	
					}
					else{
//						app.u.dump(" -> @variations is empty.");
					}
				}
					
			} //atcVariations
		}

		}
	return r;
}