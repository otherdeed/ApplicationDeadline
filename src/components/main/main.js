import React, { useState, useEffect } from 'react';
import './main.css';
import OrderBlock from './orderBlock/orderBlock';
import AddFolderModal from './folderModal/addFolderModal';
import AddDeadline from '../header/addDeadline/addDeadline';
import DeleteFolder from './deleteFolder/deleteFolder';
import FilterSetting from './filterSetting/filterSetting';
import { useSelector, useDispatch } from 'react-redux';
import { setDeadlines } from '../../store/client/myDeadlineSlice';
import { setFolderID } from '../../store/client/groupSlice';
import { setTerm, setIsopenFilter} from '../../store/client/filterSlice';
function Main() {  
    const [deleteFolderId, setDeleteFolderId] = useState(null);
    const dispatch = useDispatch();
    const folderId = useSelector(state => state.groups.folderId);
    const user = useSelector(state => state.user);
    const myGroup = useSelector(state => state.myGroup);
    const myFolders = useSelector(state => state.myGroup.folders);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalDeleteFolders, setModalDeleteFolders] = useState(false);
    const myDeadlines = useSelector(state => state.myDeadlines.deadlines) || [];
    const searchTerm = useSelector(state => state.filter.searchTerm)
    const Priority = useSelector(state => state.filter.searchPriority)
    const Time = useSelector(state => state.filter.searchTime)
    const isOpenFilter = useSelector(state => state.filter.isOpenFilter)
    const [pressTimer, setPressTimer] = useState(null);
    const [isfilterSettings, setFilterSettings] = useState(false);

    const handleSearchChange = (event) => {
        dispatch(setTerm(event.target.value))
    };

    const openDeadline = () => setModalOpen(true);
    const closeDeadline = () => setModalOpen(false);
    const openModalDeleteFolders = () => setModalDeleteFolders(true);
    const closeModalDeleteFolders = () => setModalDeleteFolders(false);
    function openFilterSetting(){
        setFilterSettings(true)
        dispatch(setIsopenFilter(true))
    }
    function closeFilterSetting(){
        setFilterSettings(false)
    }
    const handleLongPress = (folder) => {
        setDeleteFolderId(folder.id_folder);
        openModalDeleteFolders();
    };

    const startPress = (folder) => {
        const timer = setTimeout(() => {
            handleLongPress(folder);
        }, 500);
        setPressTimer(timer);
    };

    const endPress = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };
    // console.log(new Date('2024-12-31T21:00:00.000Z') < new Date());
    const filteredDeadlines = myDeadlines
    .filter(deadline => {        
        const nameMatches = deadline.name.toLowerCase().includes(searchTerm.toLowerCase());

        const priorityMatches = (Priority === null) 
            ? [1, 2, 3].includes(deadline.priority) 
            : deadline.priority === Number(Priority);

        const timeMatches = Boolean(Time)
            ? new Date(deadline.due_date) > new Date() 
            : new Date(deadline.due_date) < new Date();

        return nameMatches && priorityMatches && timeMatches;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));


    const renderDeadlines = () => {
        if (filteredDeadlines.length === 0 && folderId !== null && !isOpenFilter) {
            return <div className='noDeadline'>Нет дедлайнов</div>;
        } else if (folderId === null && myFolders.length > 0 && !isOpenFilter) {
            return <div className='noDeadline'>Выберите папку</div>;      
        } else if (myFolders.length === 0 && !isOpenFilter) {
            return <div className='noDeadline'>Создайте папку</div>;
        }
        if(folderId === null && isOpenFilter){
            return null
        }
        return filteredDeadlines.map(deadline => (
            <OrderBlock className= 'order-block'
                key={deadline.id_deadline}
                id={deadline.id_deadline}
                name={deadline.name}
                deadline={deadline.due_date}
                description={deadline.description}
                group={myGroup}
                admin={myGroup?.admin}
                userId={user.id}
            />
        ));
    };
    useEffect(() => {
        const folderID = localStorage.getItem('folders');
        if (folderID) {
            const thisFolder = myFolders.find(folder => folder.id_folder === folderID);
            if (thisFolder) {
                dispatch(setFolderID(thisFolder.id_folder));
                dispatch(setDeadlines(thisFolder.deadline));
            } else {
                console.warn(`Folder with ID ${folderID} not found in myFolders.`);
            }
        } else {
            console.warn('No folder ID found in localStorage.');
        }
    }, [myFolders, dispatch]);

    const setFolders = (id) => {
        const folder = myFolders.find(fold => fold.id_folder === id);
        dispatch(setFolderID(folder.id_folder));
        localStorage.setItem('folders', folder.id_folder);
        dispatch(setFolderID(folder.id_folder));
        dispatch(setDeadlines(folder.deadline));
    };

    const renderAddDeadlineButton = () => {
        if (myGroup?.admin === user.id && myFolders.length > 0 && folderId !== null) {
            return (
                <button className='fixed-button' onTouchStart={startPress} onTouchEnd={endPress}>
                    <AddDeadline folder={folderId} />
                </button>
            );
        }
        return null;
    };
    const renderAddFolder = () => {
        if (myGroup?.admin === user.id) {
            return(
                <div className="icon" onClick={openDeadline}>
                    <div className="plus"></div>
                    <AddFolderModal isOpen={isModalOpen} onClose={closeDeadline} />
                </div>
            ) 
        } else if(myGroup?.admin !== user.id){
            return null;
        }
    }
    const renderFolders = () => {
        if (myFolders.length === 0) {
            return <div className='noFolder'>Нет папок</div>;
        }
        return myFolders.map(folder => (
            <button
                key={folder.id_folder}
                onClick={() => setFolders(folder.id_folder)}
                onTouchStart={() => startPress(folder)}
                onTouchEnd={endPress}
                className={folderId === folder.id_folder ? 'activeFolder' : 'btnFolder'}
            >
                {folder.name}
            </button>
        ));
    };
    const renderFilter = () =>{
        return (
            <div>
                <button className='filterBtn' onClick={openFilterSetting}>Фильтры</button>
            </div>
        )
    }
    return (
        <div>
            <div className="main-container">
                <div className="order-container">
                    <div className='filterBlock'>
                        {renderFilter()}
                    </div>
                    <FilterSetting
                        isOpen={isfilterSettings}
                        onClose={closeFilterSetting}
                    />
                    <div className='FolderBlock'>
                        {renderFolders()}
                        <div className='addFolder'>
                            {renderAddFolder()}
                        </div>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                        placeholder='ПОИСК...'
                    />
                    {renderDeadlines()}  
                </div>
            </div>
            <DeleteFolder 
                isOpen={isModalDeleteFolders} 
                onClose={closeModalDeleteFolders} 
                folderId={deleteFolderId} 
            />
            {renderAddDeadlineButton()}
        </div>
    );
}

export default Main;
