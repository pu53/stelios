import React from 'react'
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
          link = 'http://api.stelios.no/'+ url;
        }
        //generated request
        console.log(link)
        var request = new Request(link, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        fetch(request).then((res) => {
          console.log(res.status);
          return res.json();
        })
        .then((res) => {
          this.setState({data:res});
          console.log(res.username);
        }).catch((e) => {
          console.log(e);
        });
    }

    componentWillMount(){
        this.fetchData();
    }

    render() {
        console.log("YAYAYAY");
        if(Object.keys(this.state.data).length > 0){
            return (

                <div>
                <br />
                <Header size='large'>Quizes</Header>
                    <Menu fluid vertical>
                       {this.state.data.quizes.map(function(quiz){
                           return <Menu.Item href= {'/quiz/'+quiz.id} ><Icon name='tasks' /> <Label color='teal'>{quiz.deadline}</Label>{ quiz.title }</Menu.Item>;
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
