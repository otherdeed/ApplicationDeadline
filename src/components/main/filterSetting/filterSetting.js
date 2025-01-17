import './filterSetting.css';
import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {setTime, setPriority,setIsopenFilter } from '../../../store/client/filterSlice';
function FilterSetting({ isOpen, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const dispatch = useDispatch()
  const Priority = useSelector(state => state.filter.searchPriority)
  const resetFilter = () => {
    dispatch(setTime(1))
    dispatch(setPriority(null)) 
  }
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      dispatch(setIsopenFilter(false))
    }, 1000); // Время анимации
  };
  if (!isOpen && !isExiting) return null;

  return (
    <div className={`FilterContainer ${isExiting ? 'scrollOut' : ''}`}>
      <div className="filter-body">
        <div className="filter-group">
          По времени
          <div>
            <div class="radio-group">
              <label class="custom-radio">
                <input type="radio" name="status" value={1} onChange={(e) => dispatch(setTime(e.target.value))}/>
                <span class="checkmark"></span>
                Актуальные
              </label>
              <label class="custom-radio">
                <input type="radio" name="status" value={0} onChange={(e) => dispatch(setTime(e.target.value))} />
                <span class="checkmark"></span>
                Просроченные
              </label>
            </div>

          </div>
        </div>
        <div className="filter-group">
          По важности
          <div className="importance-container">
            <label className="color-square" style={{ backgroundColor: "#00A838" }}>
              <input
                type="radio"
                name="priority"
                value="1"
                checked={Priority === "1"}
                onChange={(e) => dispatch(setPriority((e.target.value)))}
              />
              <span className="square-text"></span>
            </label>
            <label className="color-square" style={{ backgroundColor: "#EFA31A" }}>
              <input
                type="radio"
                name="priority"
                value="2"
                checked={Priority === "2"}
                onChange={(e) => dispatch(setPriority((e.target.value)))}
              />
              <span className="square-text"></span>
            </label>
            <label className="color-square" style={{ backgroundColor: "#B50507" }}>
              <input
                type="radio"
                name="priority"
                value="3"
                checked={Priority === "3"}
                onChange={(e) => dispatch(setPriority((e.target.value)))}
              />
              <span className="square-text"></span>
            </label>
          </div>
        </div>
      </div>
      <div className='filterSettingBtn'>
        <button onClick={resetFilter}>Сбросить</button>
        <button onClick={handleClose}>Скрыть</button>
      </div>
    </div>
  );
}

export default FilterSetting;
