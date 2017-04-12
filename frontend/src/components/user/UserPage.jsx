import React from 'react'
import { UserSubjects } from './UserSubjects'
import { UserQuizes } from './UserQuizes'
import { WelcomeMessage } from './WelcomeMessage'

export class UserPage extends React.Component {
    render() {
        return (
          <div style={{width:'100%'}}>

            {/* 'Welcome <username>' */}
            <WelcomeMessage/>

            {/* list of links to users subjects */}
            <UserSubjects/>

            {/* list of links to users quizes */}
            <UserQuizes/>
          </div>
        );
    }
}
