npm install &&
npm run build &&
rm -rf /var/www/stelios.no/html/ &&
mkdir /var/www/stelios.no/html &&
cp -R /home/stelios/frontend/build/* /var/www/stelios.no/html/

