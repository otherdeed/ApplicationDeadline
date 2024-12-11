import './header.css'
import React from 'react'
import AddDeadline from './addDeadline/addDeadline'
function Header({group, user}){
    if(group.creator?.id === user.id && user.id !== null  && user.id !== undefined  && user.id !== 'undefined'  && user.id !== 'null'  && user.id !== 'null'){
        return (
            <div className="header-container">
                {group.name}
                <AddDeadline group={group}/>
            </div>
        )
    } else if(group.creator?.id !== user.id){
        return (
            <div className="header-container">
                {group.name}
            </div>
        )
    } else{
        return (
            <div className="header-container">
                У вас нет групп
            </div>
        )
    }
}
export default Header