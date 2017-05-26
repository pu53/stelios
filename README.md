[![Build Status](https://www.travis-ci.org/pu53/stelios.svg?branch=master)](https://www.travis-ci.org/pu53/stelios)
[![Coverage Status](https://img.shields.io/badge/Coverage-LOL-red.svg)](https://coveralls.io/github/pu53/stelios?branch=master)
[![My Name](https://img.shields.io/badge/My%20Name-Jeff-green.svg)](http://images2.storyjumper.com/transcoder.png?trim&id=16-4hltn1jwl3-il14efj9&maxw=512&maxh=512)
[![Made By](https://img.shields.io/badge/Made%20By-Andreas-blue.svg)](https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Sabaoth_icon_%28Russia%2C_19_c.%29_2.jpeg/220px-Sabaoth_icon_%28Russia%2C_19_c.%29_2.jpeg)
[![Fuck It](https://img.shields.io/badge/Fuck%20It-Ship%20It-yellow.svg)](http://images2.storyjumper.com/transcoder.png?trim&id=16-4hltn1jwl3-il14efj9&maxw=512&maxh=512)
[![Homepage](https://img.shields.io/badge/You%20Are%20In-Homepage-lightgrey.svg)](http://stelios.no)

# Stelios
A web app that will **revolutionize learning experience**!

This project is our main assigment for the course **TDT4140**.

## Installation
Prerequirements are nodejs 7.x, npm 4.x, a postgresql server and python 3. You can skip some of the commands below if you have these

For the PostgreSQL server in development we use the default user postgres with the default password postgres.

If you set up this in production You must also make a user, stelios_user.

You must also give stelios_user all permissions for the database stelios_backend if in production.

### Backend
```bash
git clone https://github.com/pu53/stelios.git
cd stelios/
curl -sL https://deb.nodesource.com/setup_7.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential

sudo apt-get install postgresql postgresql-contrib
#install postgres with the default settings. postgres as username and postgres as password. You can look at backend/backend/settings/settings_dev.py if you want to look for the settings related with the database.
sudu -u postgres psql -c 'CREATE DATABASE stelios_backend;'

cd backend/

pip3 install -r requirements.txt

python3 manage.py makemigrations wiki
python3 manage.py makemigrations quiz
python3 manage.py makemigrations profiles
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver
```

### Frontend
```bash
open a new terminal, navigate to the stelios folder and run these commands
cd frontend/
npm install
npm start
```

now you can go to localhost:3000 to load the frontend.
to browse the api you can go to localhost:8000/api/ to get a list over all api urls. for example localhost:8000/api/subjects/
to get into the admin interface go to localhost:8000/api/admin/

To set up a user to have professor priviliges you have to go to the users profile in the admin interface and set the professor flag to true.
Then you have to go to the user and give them all the permissions.

In order for the site to work properly you may (still unclear) have to have 1 subject allready created. To do this go to
localhost:8000/api/admin/ and log in with the superuser you created above. Then go to subjects and create one. From there you use the frontends logic to create new subjects, topics, quizes and so on.


## Usage
Our project is divided into to parts, the backend and the frontend.
### Backend
```bash
cd backend

python3 manage.py runserver
```

### Frontend

```bash
cd frontend

npm start
```



## Code Examples

### Serializers
```python
class QuestionSerializer(QueryFieldsMixin,serializers.ModelSerializer):
	class Meta:
		model = Question
		fields = ('__all__')
```
Classes in serializers.py create JSON objects of all data stored in `fields`, in this case all data related to a Question object will be sent.

### React Components

```js
import React from 'react'
import { UserSubjects } from './UserSubjects'
[...]

export class UserPage extends React.Component {
    render() {
        return (
          <div style={{width:'100%'}}>

            {/* 'Welcome <username>' */}
            <WelcomeMessage/>
            [...]
        );
    }
}

```

React components can be imported and displayed like shown above with the component `WelcomeMessage`.

**TODO:** write more examples


## Built With

* [React](https://facebook.github.io/react/) - Frontend javascript library, our whole frontend app is written in react.
* [Django](https://www.djangoproject.com/) - Backend python web-framework
* [Django REST framework](http://www.django-rest-framework.org/) - Backend api framework built on top of django, creates the JSON api interface
* [PostgreSQL](https://www.postgresql.org/) - A fast, reliable and production ready SQL database
* [Semantic-UI](https://semantic-ui.com/) - CSS framework thats easy, comfortable and fast to use

## API

GET `http://api.stelios.no/users/data/1/`

Returns:

```json
{
    "id": 1,
    "username": "pekka",
    "profile": {
        "study": "MTDT",
        "subjects": []
    },
    "subjects": [],
    "quizes": []
}
```

## Testing

### Testing backend
```bash
cd backend

coverage run --branch --source=quiz,wiki,profiles ./manage.py test
coverage report
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Live Version

[http://stelios.no/](http://stelios.no/)

What the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo.
