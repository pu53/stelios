import React from 'react'
import { NavLink } from '../NavLink.jsx';
import { Menu, Header } from 'semantic-ui-react'
import { getData } from '../../helpers'

import { sendData } from '../../helpers.jsx'

export class AddSubject extends React.Component {
    constructor(props) {
		super(props);
	}

    addSubject(subjectID){
        let userID = localStorage.getItem('stelios_current_user')
        if(userID === 'null'){
			console.log("Error! No userID");
			return;
		}

        var request = {
            user : userID,
            subject : subjectID
        }

        sendData("addSubject/","put",request,(()=>{}),(()=>{}),(()=>{}))
    }


    /* Creates a list of links to a users subjects */
    render() {
        return (
            <div>
            <button onClick = {this.addSubject(this.props.subject)}>Add Subject</button>
           </div>
        );
    }
}
