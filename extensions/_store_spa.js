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
			},
		},
		
		callbacks : {
			init : {
				onSuccess : function(){
					app.u.dump('BEGIN app.ext_store_spa.callbacks.init.onSuccess');
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
			
		},//END u FUNCTIONS
		
		renderFormats : {
			
		}
	}
	return r;
}