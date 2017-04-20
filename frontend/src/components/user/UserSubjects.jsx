import React from 'react'
import { NavLink } from '../NavLink.jsx';
import { Menu, Header } from 'semantic-ui-react'

export class UserSubjects extends React.Component {
    constructor(props) {
		super(props);
		this.state = ({
			data: {},
			value: ''
		});
	}

    fetchData(){
        var link = '';
        var url = 'users/data/' + localStorage.getItem('stelios_current_user') + '/?format=json';
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          link = 'http://localhost:8000/api/'+ url;
        } else {
          link = 'https://stelios.no/api/'+ url;
        }
        //generated request
        var request = new Request(link, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        fetch(request).then((res) => {
          return res.json();
        })
        .then((res) => {
          this.setState({data:res});
        }).catch((e) => {
          console.log(e);
        });
    }

    componentWillMount(){
        this.fetchData();
    }

    /* Creates a list of links to a users subjects */
    render() {
        if(Object.keys(this.state.data).length > 0){
            return (

                <div>
                <Header size='large'>Subjects</Header>
                    <Menu fluid vertical>
                       {this.state.data.subjects.map(function(subject, index){
                           return <NavLink to={'/wiki/'+subject.id} key={index}><Menu.Item >{ subject.name }</Menu.Item></NavLink>;
                         })}
                    </Menu>
               </div>

            );
        } else {
            return(
                <div>You are not signed in.</div>
            )
        }
    }
}
