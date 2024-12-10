import './header.css'
import React from 'react'
import AddDeadline from './addDeadline/addDeadline'
function Header({group, user}){
    if(group.creator_id === user.id){
        return (
            <div className="header-container">
                {group.name}
                <AddDeadline group={group}/>
            </div>
        )
    } else if(group.creator_id !== user.id){
        return (
            <div className="header-container">
                {group.name}
            </div>
        )
    } else{
        return (
            <div className="header-container">
                Произошла ошибка
            </div>
        )
    }
}
export default Header