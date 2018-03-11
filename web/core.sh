#!/bin/bash
LIST="bower_components/jquery/dist/jquery bower_components/angular/angular bower_components/angular-route/angular-route bower_components/angular-touch/angular-touch bower_components/angular-loader/angular-loader"
LIST="${LIST} bower_components/angular-cookies/angular-cookies bower_components/angular-facebook/lib/angular-facebook bower_components/angular-local-storage/angular-local-storage bower_components/toastr/toastr"
LIST="${LIST} bower_components/ngInfiniteScroll/build/ng-infinite-scroll"

rm -f app/core.min.js
for i in $LIST; do
   if [ -f ${i}.minOOOO.js ]; then
      cat ${i}.min.js  >> app/core.min.js
   else
      cat ${i}.js >> app/core.min.js
   fi
   printf "\n" >> app/core.min.js
done   
