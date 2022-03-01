import React from "react";
import {Draggable} from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";


const Card = styled.div<{isDragging: boolean}>`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr;
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${props => props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${props => props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 1)" : "none"};
`;

const XButton = styled.button`
    border-radius: 5px;
    border: none;
`;

interface IDraggableCardProps {
    boardId: string;
    toDoId: number;
    toDoText: string;
    index: number;
}

function DraggableCard({ boardId, toDoId, toDoText, index}: IDraggableCardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const {currentTarget: { name },} = event;
        setToDos(allBoards => {  //삭제버튼 완성
            const targetBoard = [...allBoards[boardId]];
            const targetIndex = targetBoard.findIndex(toDo => toDo.id === toDoId);
            targetBoard.splice(targetIndex, 1);
            return {...allBoards,
                [boardId]: targetBoard
            };
        })
    }

    return (
        <Draggable draggableId={toDoId+""} index={index}>
            {(magic, snapshot) => 
            <div>
            <Card 
                isDragging={snapshot.isDragging}
                ref={magic.innerRef} 
                {...magic.draggableProps} 
                {...magic.dragHandleProps}
                >
                {toDoText}<XButton name={toDoText} onClick={onClick}>X</XButton>
            </Card>
            </div>
            }
        </Draggable>
    )
}

export default React.memo(DraggableCard);