import React, { useState } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  background-color: #fff;
  color: #333;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  &:hover{
    background-color: #eee;
    border: 1px solid transparent;
  }
`
const StyledSmallButton = styled(StyledButton)`
  padding: 4px 8px;
  font-size: 12px;
`

const App = () => { 
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  const buttonStyle = {
    padding: '8px 16px',
    border: hovered ? '1px solid transparent' : '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    backgroundColor: hovered ? '#eee' : '#fff',
    color: '#333',
    fontSize: '16px',
    transition: 'all 0.3s ease-in-out'
  }

  return (
    <div>
      <header>
        <p className="bg-red-400">Hello Vite + React</p>
      </header>
      <h2>Hello World!!!!</h2>
      {/* 直接使用style对象 */}
      <button
        style={buttonStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { 
          setCount(count + 1);
        }
      }>count is {count}</button>
      <br /><br />

      {/* 使用styled-components */}
      <StyledButton
        onClick={() => { 
          setCount(count + 1);
        }
      }>
        count is {count}
      </StyledButton>
      <StyledSmallButton
        onClick={() => { 
          setCount(count + 1);
        }
      }>
        count is {count}
      </StyledSmallButton>

    </div>
  )
}
export default App;