import React from 'react'
import { UserSubjects } from './UserSubjects'
import { UserQuizes } from './UserQuizes'
import { WelcomeMessage } from './WelcomeMessage'

export class UserPage extends React.Component {
    render() {


        return (
          <div style={{width:'100%'}}>
            <WelcomeMessage/>
            <UserSubjects/>
            <UserQuizes/>
          </div>
        );
    }
}
