# create directory
mkdir capture
mkdir data
mkdir public/images

# install modules
npm install

# install node and mongodb
apt install nodejs npm mongodb

# to start mongodb
mongod --dbpath data
