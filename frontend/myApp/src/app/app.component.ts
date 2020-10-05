import { Component,ViewChildren ,OnInit, QueryList} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabGroup} from '@angular/material/tabs'
import { HttpClient }    from '@angular/common/http';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import {AppService} from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //@ViewChild('tab-0') tab: MatTabGroup;
  //@ViewChild('tabs') tab1 :MatTabGroup;
  @ViewChildren('tabs') tab: QueryList<MatTabGroup>;
  selectedIndex:number;

  title = 'myApp';
  //inputForm = new FormControl('');
  inputForm = new FormGroup({
    inputKeyword : new FormControl('',[Validators.required]),
    minPrice : new FormControl(''),
    maxPrice : new FormControl(''),
    newC : new FormControl(''),
    used : new FormControl(''),
    verygood : new FormControl(''),
    good : new FormControl(''),
    acceptable : new FormControl(''),
    returnOnly : new FormControl(''),
    free : new FormControl(''),
    expedited : new FormControl(''),
    sortby : new FormControl('BestMatch')
  },{updateOn:'submit'});

  isSubmitted : boolean =false;
  priceWrong :boolean = false;
  noResult :boolean = false;
  url :string ='';
  searchResult = new Array();
  p:number =1;
  isLoaded : boolean = false;
  ishidden = new Array();
  isSmallScreen :boolean = false;
  innerWidth:any;
  isreset:boolean=true;


  constructor(private toService : AppService) {}


  ngOnInit(){
    this.ishidden = [true,true,true,true,true];
    if(window.innerWidth <= 415) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }

   console.log(this.isSmallScreen);
  }

  formInit() {
    this.inputForm = new FormGroup({
      inputKeyword : new FormControl('',[Validators.required]),
      minPrice : new FormControl(''),
      maxPrice : new FormControl(''),
      newC : new FormControl(''),
      used : new FormControl(''),
      verygood : new FormControl(''),
      good : new FormControl(''),
      acceptable : new FormControl(''),
      returnOnly : new FormControl(''),
      free : new FormControl(''),
      expedited : new FormControl(''),
      sortby : new FormControl('BestMatch')
    },{updateOn:'submit'});
    this.isLoaded = false;
  }
  expandToggle(index) {
    //console.log(this.tab1);
    //console.log(this.isHidden0);
    //let el = document.getElementById("col-1");
    //console.log(el.children.item(0));
    //let elh = el.children.item(0).children.item(1).children.item(0).children.item(0).children;
    this.tab.forEach((child)=> { child.realignInkBar()});
    this.ishidden[index] = !this.ishidden[index];
    console.log(this.ishidden);
  }
  reset() {
    this.inputForm.reset();
    this.formInit();
    this.isreset = true;
    console.log("isreset: ",this.isreset);
    this.p=1;
    this.noResult = false;
    this.priceWrong = false;
    this.ishidden = [true,true,true,true,true];


  }


  onSubmit() {

    this.isSubmitted =true;
    this.isreset = false;
    this.p=1;
    console.log("isreset: ",this.isreset);
    if((this.inputForm.get('minPrice').value !== ''|| this.inputForm.get('minPrice').value !== null) && this.inputForm.get('minPrice').value<0) {

      this.priceWrong = true;

      return;
      //console.log("in the if",this.isNegative,this.isSubmitted);
    }
    else {
      this.priceWrong=false;
    }
    if((this.inputForm.get('maxPrice').value !== ''|| this.inputForm.get('maxPrice').value !== null) && this.inputForm.get('maxPrice').value<0) {
      console.log("max neg work")
      this.priceWrong = true;


    }
    else {
      this.priceWrong=false;
    }
    if((this.inputForm.get('maxPrice').value !==''||this.inputForm.get('maxPrice').value !==null) && (this.inputForm.get('minPrice').value !== '' || this.inputForm.get('minPrice').value !== null)&& this.inputForm.get('minPrice').value > this.inputForm.get('maxPrice').value) {
      this.priceWrong = true;

    }
    else {
      this.priceWrong = false;
    }
    if(!this.priceWrong && this.inputForm.get('inputKeyword').valid) {
      //this.url = "http://127.0.0.1:8080?";
      this.url="https://csci571-hello.wl.r.appspot.com/?"
      this.url += "&sortby="+this.inputForm.get('sortby').value;
      console.log("sortby ",this.inputForm.get('sortby').value);
      let rawKeyword = this.inputForm.get('inputKeyword').value.split(" ");
      let keywordTrue = rawKeyword[0];
      if(rawKeyword.length >1) {
        for(var i = 1; i<rawKeyword.length; i++) {
          keywordTrue = keywordTrue.concat("%20",rawKeyword[i]);
        }
      }

      this.url += "&keyword="+keywordTrue;


      if(this.inputForm.get('maxPrice').value == null || this.inputForm.get('maxPrice').value == '') {
        this.url += "&maxprice="
      }
      else {
        this.url += "&maxprice="+this.inputForm.get('maxPrice').value;
      }
      console.log("max price :",this.inputForm.get('maxPrice').value);

      if (this.inputForm.get('minPrice').value == null || this.inputForm.get('minPrice').value == '') {
        this.url += "&minprice="
      }
      else {
        this.url += "&minprice="+this.inputForm.get('minPrice').value;
      }
      if(this.inputForm.get('returnOnly').value == "") {
        this.url += "&returnOnly=false";
      }
      else {
        this.url += "&returnOnly="+this.inputForm.get('returnOnly').value;
      }
      if(this.inputForm.get('free').value == "") {
        this.url += "&freeshipOnly=false";
      }
      else {
        this.url += "&freeshipOnly="+this.inputForm.get('free').value;
      }
      if(this.inputForm.get('expedited').value == "") {
        this.url += "&expship=false";
      }
      else {
        this.url += "&expship="+this.inputForm.get('expedited').value;
      }
      if(this.inputForm.get('newC').value) {
        this.url += "&condition_new=1000";
      }
      else{
        this.url += "&condition_new=0";
      }
      if(this.inputForm.get('used').value) {
        this.url += "&condition_used=3000";
      }
      else{
        this.url += "&condition_used=0";
      }
      if(this.inputForm.get('verygood').value) {
        this.url += "&condition_verygood=4000";
      }
      else{
        this.url += "&condition_verygood=0";
      }
      if(this.inputForm.get('good').value) {
        this.url += "&condition_good=5000";
      }
      else {
        this.url += "&condition_good=0";
      }
      if(this.inputForm.get('acceptable').value) {
        this.url += "&condition_acceptable=6000";
      }
      else {
        this.url += "&condition_acceptable=0";
      }
      this.toService.setURL(this.url);
      console.log(this.url);



      console.log("working",this.inputForm.get('free'));
      this.toService.getData().subscribe((data)=> {
        if(data['findItemsAdvancedResponse'][0]['paginationOutput'][0]['totalEntries'][0] == "0") {
          this.noResult =true;
        }
        else {
          for(var i=0;i<data['findItemsAdvancedResponse'][0].searchResult[0].item.length;i++) {
            //console.log("condition: ", data['findItemsAdvancedResponse'][0].searchResult[0].item[i].condition);
            if(typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].title== "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].sellingStatus=="undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].location=="undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].primaryCategory =="undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].condition =="undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo=="undefined"||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].viewItemURL == "undefined") {
               continue;
               }

            if (
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].sellingStatus[0].currentPrice =="undefined" ||

               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].primaryCategory[0].categoryName =="undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].condition[0].conditionDisplayName =="undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingType=="undefined"||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingServiceCost == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shipToLocations == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].expeditedShipping == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].oneDayShippingAvailable == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].bestOfferEnabled == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].buyItNowAvailable == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].listingType == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].gift == "undefined" ||
               typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].watchCount=="undefined") {
                 continue;

            }
            if (typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].sellingStatus[0].currentPrice[0]['__value__']=="undefined" ||
                typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingServiceCost[0]['__value__'] == "undefined") {
                  continue;

            }
            if(data['findItemsAdvancedResponse'][0].searchResult[0].item[i].title[0]== "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].sellingStatus[0].currentPrice[0]['__value__']=="" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].location[0]=="" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].primaryCategory[0].categoryName[0] =="" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].condition[0].conditionDisplayName[0] =="" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingType[0]==""||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingServiceCost[0]['__value__'] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shipToLocations[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].expeditedShipping[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].oneDayShippingAvailable[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].bestOfferEnabled[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].buyItNowAvailable[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].listingType[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].gift[0] == "" ||
               data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].watchCount[0]=="") {
                 continue;
               }
               if (typeof data['findItemsAdvancedResponse'][0].searchResult[0].item[i].galleryURL == "undefined") {
                 var galleryURL = "assets/ebayDefault.png";
               }
               else {
                 if(data['findItemsAdvancedResponse'][0].searchResult[0].item[i].galleryURL[0]=="" ||
                    data['findItemsAdvancedResponse'][0].searchResult[0].item[i].galleryURL[0]== "https://thumbs1.ebaystatic.com/pict/04040_0.jpg"
                    ) {
                      var galleryURL = "assets/ebayDefault.png";
                    }
                 else {
                   var galleryURL = data['findItemsAdvancedResponse'][0].searchResult[0].item[i].galleryURL[0];
                 }
               }

               console.log(galleryURL);
               //console.log("price: " , data['findItemsAdvancedResponse'][0].searchResult[0].item[i].sellingStatus[0].currentPrice[0].__value__);
          this.searchResult.push({title:data['findItemsAdvancedResponse'][0].searchResult[0].item[i].title,
                                  price:data['findItemsAdvancedResponse'][0].searchResult[0].item[i].sellingStatus[0].currentPrice[0].__value__,
                                  location:data['findItemsAdvancedResponse'][0].searchResult[0].item[i].location[0],
                                  category:data['findItemsAdvancedResponse'][0].searchResult[0].item[i].primaryCategory[0].categoryName[0],
                                  condition:data['findItemsAdvancedResponse'][0].searchResult[0].item[i].condition[0].conditionDisplayName[0],
                                  shippingType:data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingType[0],
                                  shippingCost: data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shippingServiceCost[0]['__value__'],
                                  shipToLocation: data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].shipToLocations[0],
                                  expeditedShipping :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].expeditedShipping[0],
                                  oneDayShip :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].shippingInfo[0].oneDayShippingAvailable[0],
                                  bestOffer :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].bestOfferEnabled[0],
                                  buyItNow :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].buyItNowAvailable[0],
                                  listType :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].listingType[0],
                                  gift :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].gift[0],
                                  watchCount : data['findItemsAdvancedResponse'][0].searchResult[0].item[i].listingInfo[0].watchCount[0],
                                  productURL :data['findItemsAdvancedResponse'][0].searchResult[0].item[i].viewItemURL[0],
                                  imageURL : galleryURL});
          }
        }

        this.isLoaded = true;
      //  console.log(data['findItemsAdvancedResponse'][0].searchResult[0].item[0].title);

      });
    }
    this.ishidden = [true,true,true,true,true];
    this.searchResult = [];
    this.noResult = false;
    this.isLoaded = false;

  }



}
