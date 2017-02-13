

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - &&
apt-get install -y build-essential &&
apt-get install -y nodejs &&

apt-get install dos2unix &&

npm install -g create-react-app &&
npm install -g react-scripts &&

apt-get install libpq-dev &&
apt install python3-pip &&
pip3 install --upgrade pip &&

pip3 install django &&
pip3 install djangorestframework &&
pip3 install markdown &&
pip3 install django-filter &&
pip3 install psycopg2 &&
pip3 install django-cors-headers &&
pip3 install gunicorn
