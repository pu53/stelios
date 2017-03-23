import React from 'react'
import { UserSubjects } from './UserSubjects'

export class UserPage extends React.Component {
    render() {
        

        return (
          <div style={{width:'100%'}}>
            <h1>Welcome to STELIOS!</h1>
            <div>You are on the user page</div>
            <UserSubjects/>
          </div>
        );
    }
}
