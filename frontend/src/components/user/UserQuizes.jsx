import React from 'react'
import { NavLink } from '../NavLink.jsx';
import { Menu, Label, Header, Icon } from 'semantic-ui-react'

export class UserQuizes extends React.Component {
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
          link = 'http://localhost:8000/'+ url;
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
          /*console.log(res.status);*/
          return res.json();
        })
        .then((res) => {
          this.setState({data:res});
          /*console.log(res.username);*/
        }).catch((e) => {
          console.log(e);
        });
    }

    componentWillMount(){
        this.fetchData();
    }

    /* Creates a list of links to a users quizes */
    render() {
        if(Object.keys(this.state.data).length > 0){
            return (
                <div>
                <br />
                <Header size='large'>Quizes</Header>
                    <Menu fluid vertical>
                       {this.state.data.quizes.map(function(quiz, index){
                           return <NavLink to={'/quiz/'+quiz.id} key={index}><Menu.Item ><Icon name='tasks' /> <Label color='teal'>{quiz.deadline}</Label>{ quiz.title }</Menu.Item></NavLink>;
                         })}
                    </Menu>
               </div>

            );
        } else {
            return(
                <div></div>
            )
        }
    }
}
