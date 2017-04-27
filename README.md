[![Build Status](https://www.travis-ci.org/pu53/stelios.svg?branch=master)](https://www.travis-ci.org/pu53/stelios)
[![Coverage Status](https://coveralls.io/repos/github/pu53/stelios/badge.svg?branch=master)](https://coveralls.io/github/pu53/stelios?branch=master)

# Stelios
A web app that will **revolutionize learning experience**!

This project is our main assigment for the course **TDT4140**.

## Installation
#You have to have postgres installed and running. In development we use the default user postgres with the default password postgres.
#You must also make a user, stelios_user in prodcution, just use postgres (the user) in development.
#You must also give stelios_user all permissions for the database stelios_backend if in production
### Backend
```bash

psql -c 'CREATE DATABASE stelios_backend;' -U <username>

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
cd frontend/
npm install
npm start
```

now you can go to localhost:3000 to get the frontend.
to browse the api you can go to localhost:8000/api/ to get a list over all api urls. for example localhost:8000/api/subjects/
to get into the admin interface go to localhost:8000/api/admin/

To set up a user to have professor priviliges you have to go to the users profile in the admin interface and set the professor flag to true.
Then you have to go to the user and give them all the permissions.

In order for the site to work properly you may have to have 1 subject allready created. To do this go to
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
